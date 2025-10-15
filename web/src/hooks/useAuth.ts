'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAccount, useSignMessage, useChainId } from 'wagmi';
import { SiweMessage } from 'siwe';
import { apiClient, AuthResponse } from '@/lib/api';

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string | null;
  address: string | null;
  chainId: number | null;
  error: string | null;
  needsRegistration: boolean;
  isProcessingRegistration: boolean;
}

export function useAuth() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { signMessageAsync } = useSignMessage();

  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: false,
    token: null,
    address: null,
    chainId: null,
    error: null,
    needsRegistration: false,
    isProcessingRegistration: false,
  });

  const notifyExtension = useCallback((token: string, address: string, chainId: number, expiresAt: number, retryCount = 0) => {
    if (typeof window !== 'undefined') {
      try {
        console.log('Sending AUTH_SUCCESS to extension via content script:', { token: token.substring(0, 10) + '...', address, chainId, expiresAt, retryCount });
        
        window.postMessage({
          type: 'TUBEDAO_AUTH_SUCCESS',
          token,
          address,
          chainId,
          expiresAt,
        }, window.location.origin);
        
        console.log('Auth message sent to content script');
        
        // Set up a retry mechanism if no confirmation received
        if (retryCount < 3) {
          setTimeout(() => {
            // Check if we got confirmation, if not retry
            const hasConfirmation = document.querySelector('[data-auth-confirmed="true"]');
            if (!hasConfirmation) {
              console.log(`Retrying auth notification (attempt ${retryCount + 1})`);
              notifyExtension(token, address, chainId, expiresAt, retryCount + 1);
            }
          }, 1000);
        }
      } catch (error) {
        console.log('Failed to send auth message:', error);
      }
    } else {
      console.log('Window not available');
    }
  }, []);

  const notifyExtensionLogout = useCallback(() => {
    if (typeof window !== 'undefined') {
      try {
        console.log('Sending AUTH_REQUIRED to extension via content script');
        
        window.postMessage({
          type: 'TUBEDAO_AUTH_REQUIRED',
        }, window.location.origin);
        
        console.log('Logout message sent to content script');
      } catch (error) {
        console.log('Failed to send logout message:', error);
      }
    }
  }, []);

  const clearAuth = useCallback(() => {
    localStorage.removeItem('tubedao_token');
    localStorage.removeItem('tubedao_address');
    localStorage.removeItem('tubedao_expires_at');
    
    setAuthState({
      isAuthenticated: false,
      isLoading: false,
      token: null,
      address: null,
      chainId: null,
      error: null,
      needsRegistration: false,
      isProcessingRegistration: false,
    });
  }, []);

  const checkAuthSession = useCallback(async () => {
    try {
      const token = localStorage.getItem('tubedao_token');
      const storedAddress = localStorage.getItem('tubedao_address');
      const expiresAt = localStorage.getItem('tubedao_expires_at');

      if (!token || !storedAddress || !expiresAt) {
        return;
      }

      // Check if token is expired
      if (Date.now() > parseInt(expiresAt)) {
        clearAuth();
        return;
      }

      // Verify token with backend
      const response = await apiClient.checkAuthStatus(token);
      if (response.authenticated) {
        setAuthState({
          isAuthenticated: true,
          isLoading: false,
          token,
          address: storedAddress,
          chainId: response.chainId || chainId,
          error: null,
          needsRegistration: false,
          isProcessingRegistration: false,
        });

        // Notify extension about successful auth
        notifyExtension(token, storedAddress, response.chainId || chainId, parseInt(expiresAt));
      } else {
        clearAuth();
      }
    } catch (error) {
      console.error('Error checking auth session:', error);
      clearAuth();
    }
  }, [chainId, notifyExtension, clearAuth]);

  // Check for existing auth session on load
  useEffect(() => {
    checkAuthSession();
  }, [checkAuthSession]);

  // Handle wallet connection changes
  useEffect(() => {
    if (!isConnected) {
      clearAuth();
    }
  }, [isConnected, address, clearAuth]);

  const authenticate = useCallback(async () => {
    if (!address || !isConnected) {
      setAuthState(prev => ({ ...prev, error: 'Please connect your wallet first' }));
      return;
    }

    // Check if MetaMask is available
    if (typeof window !== 'undefined' && !window.ethereum) {
      setAuthState(prev => ({ ...prev, error: 'MetaMask is not installed. Please install MetaMask and try again.' }));
      return;
    }

    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // Step 1: Get nonce from backend
      const { nonce } = await apiClient.generateNonce(address);

      // Step 2: Create SIWE message (using current chain)
      const message = new SiweMessage({
        domain: window.location.host,
        address: address,
        statement: 'Sign in to TubeDAO with Ethereum to access your data dashboard.',
        uri: window.location.origin,
        version: '1',
        chainId: chainId || 1, // Default to mainnet if chainId is undefined
        nonce: nonce,
        issuedAt: new Date().toISOString(),
      });

      const messageString = message.prepareMessage();

      // Step 3: Sign the SIWE message
      const siweSignature = await signMessageAsync({
        message: messageString,
      });

      // Step 4: Initial SIWE verification
      try {
        const siweResponse = await apiClient.verifySIWE(messageString, siweSignature);
        
        // Check if response has tempToken (new user) or token (existing user)
        if ('tempToken' in siweResponse) {
          // New user - proceed with Moksha binding
          await handleMokshaBinding(siweResponse, address, messageString, siweSignature);
        } else {
          // Existing user - authentication complete
          const finalAuthResponse = siweResponse as AuthResponse;
          
          // Store final auth data
          localStorage.setItem('tubedao_token', finalAuthResponse.token);
          localStorage.setItem('tubedao_address', finalAuthResponse.address);
          localStorage.setItem('tubedao_expires_at', finalAuthResponse.expiresAt.toString());

          setAuthState({
            isAuthenticated: true,
            isLoading: false,
            token: finalAuthResponse.token,
            address: finalAuthResponse.address,
            chainId: finalAuthResponse.chainId,
            error: null,
            needsRegistration: false,
            isProcessingRegistration: false,
          });

          // Notify extension about successful auth
          notifyExtension(finalAuthResponse.token, finalAuthResponse.address, finalAuthResponse.chainId, finalAuthResponse.expiresAt);
        }

      } catch (verifyError: unknown) {
        const error = verifyError as Error;
        if (error.message.includes('registration required')) {
          // Start registration process
          await handleRegistrationFlow(messageString, siweSignature, address);
        } else {
          throw verifyError;
        }
      }

    } catch (error: unknown) {
      const authError = error as Error;
      console.error('Authentication error:', authError);
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: authError.message || 'Authentication failed',
      }));
    }
  }, [address, isConnected, chainId, signMessageAsync, notifyExtension]);

  const handleMokshaBinding = useCallback(async (siweResponse: { tempToken: string }, userAddress: string, siweMessage: string, siweSignature: string) => {
    try {
      // Step 5: Sign binding message for Moksha identity
      const bindingMessage = `Bind this wallet to TubeDAO Moksha identity.\n\nAddress: ${userAddress}\nTimestamp: ${new Date().toISOString()}`;
      
      const bindingSignature = await signMessageAsync({
        message: bindingMessage,
      });

      // Step 6: Send binding to backend for relayer processing
      const finalAuthResponse = await apiClient.bindMokshaIdentity(
        userAddress,
        bindingMessage,
        bindingSignature,
        siweResponse.tempToken
      );

      // Check if registration is required
      if (finalAuthResponse.registrationNeeded) {
        // User needs to register, start registration flow
        await handleRegistrationFlow(siweMessage, siweSignature, userAddress);
        return;
      }

      // Store final auth data
      localStorage.setItem('tubedao_token', finalAuthResponse.token);
      localStorage.setItem('tubedao_address', finalAuthResponse.address);
      localStorage.setItem('tubedao_expires_at', finalAuthResponse.expiresAt.toString());

      setAuthState({
        isAuthenticated: true,
        isLoading: false,
        token: finalAuthResponse.token,
        address: finalAuthResponse.address,
        chainId: finalAuthResponse.chainId,
        error: null,
        needsRegistration: false,
        isProcessingRegistration: false,
      });

      // Notify extension about successful auth
      notifyExtension(finalAuthResponse.token, finalAuthResponse.address, finalAuthResponse.chainId, finalAuthResponse.expiresAt);

    } catch (error: unknown) {
      const bindingError = error as Error;
      console.error('Moksha binding error:', bindingError);
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: bindingError.message || 'Failed to bind Moksha identity',
      }));
    }
  }, [signMessageAsync, notifyExtension]);

  const handleRegistrationFlow = useCallback(async (siweMessage: string, siweSignature: string, userAddress: string) => {
    setAuthState(prev => ({ 
      ...prev, 
      isProcessingRegistration: true,
      needsRegistration: true,
      error: null 
    }));

    try {
      // Step 1: Sign binding message for registration
      const bindingMessage = `Register this wallet with TubeDAO on Moksha.\n\nAddress: ${userAddress}\nTimestamp: ${new Date().toISOString()}`;
      
      const bindingSignature = await signMessageAsync({
        message: bindingMessage,
      });

      // Step 2: Submit registration request to backend
      const registrationResponse = await apiClient.registerWithMoksha(
        userAddress,
        siweMessage,
        siweSignature,
        bindingMessage,
        bindingSignature
      );

      // Step 3: Poll for registration completion
      await pollRegistrationStatus(registrationResponse.registrationId, userAddress);

    } catch (error: unknown) {
      const registrationError = error as Error;
      console.error('Registration error:', registrationError);
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        isProcessingRegistration: false,
        error: registrationError.message || 'Registration failed',
      }));
    }
  }, [signMessageAsync, notifyExtension]);

  const pollRegistrationStatus = useCallback(async (registrationId: string, userAddress: string) => {
    const maxAttempts = 30; // 5 minutes with 10 second intervals
    let attempts = 0;

    const poll = async () => {
      try {
        const status = await apiClient.checkRegistrationStatus(registrationId);
        
        if (status.completed && status.token) {
          // Registration successful
          localStorage.setItem('tubedao_token', status.token);
          localStorage.setItem('tubedao_address', userAddress);
          localStorage.setItem('tubedao_expires_at', (status.expiresAt || (Date.now() + 24 * 60 * 60 * 1000)).toString());

          setAuthState({
            isAuthenticated: true,
            isLoading: false,
            token: status.token,
            address: userAddress,
            chainId: status.chainId || null,
            error: null,
            needsRegistration: false,
            isProcessingRegistration: false,
          });

          // Notify extension
          notifyExtension(status.token, userAddress, status.chainId || 1, status.expiresAt || (Date.now() + 24 * 60 * 60 * 1000));
          return;
        }

        if (status.failed) {
          throw new Error(status.error || 'Registration failed on Moksha network');
        }

        // Continue polling if still processing
        attempts++;
        if (attempts < maxAttempts) {
          setTimeout(poll, 10000); // Poll every 10 seconds
        } else {
          throw new Error('Registration timeout - please try again');
        }

      } catch (error: unknown) {
        const pollError = error as Error;
        setAuthState(prev => ({
          ...prev,
          isLoading: false,
          isProcessingRegistration: false,
          error: pollError.message || 'Registration failed',
        }));
      }
    };

    poll();
  }, [notifyExtension]);

  const logout = useCallback(async () => {
    const token = authState.token;
    
    try {
      if (token) {
        await apiClient.logout(token);
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      clearAuth();
      // Notify extension about logout
      notifyExtensionLogout();
    }
  }, [authState.token, clearAuth, notifyExtensionLogout]);

  // Debug function - expose to window for manual testing
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).debugNotifyExtension = () => {
        const token = localStorage.getItem('tubedao_token');
        const address = localStorage.getItem('tubedao_address');
        const expiresAt = localStorage.getItem('tubedao_expires_at');
        
        if (token && address && expiresAt) {
          console.log('Manual debug: Sending auth to extension');
          notifyExtension(token, address, 1, parseInt(expiresAt));
        } else {
          console.log('Manual debug: No auth data found in localStorage');
        }
      };
      
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as unknown as { debugCheckExtension: () => void }).debugCheckExtension = () => {
        console.log('Checking if extension content script is loaded...');
        window.postMessage({ type: 'TUBEDAO_EXTENSION_PING' }, window.location.origin);
      };
      
      (window as unknown as { debugForceAuth: () => void }).debugForceAuth = () => {
        const token = localStorage.getItem('tubedao_token');
        const address = localStorage.getItem('tubedao_address');
        const expiresAt = localStorage.getItem('tubedao_expires_at');
        
        if (token && address && expiresAt) {
          console.log('🔥 FORCE SENDING AUTH TO EXTENSION');
          window.postMessage({
            type: 'TUBEDAO_AUTH_SUCCESS',
            token,
            address,
            chainId: 1,
            expiresAt: parseInt(expiresAt),
          }, window.location.origin);
        } else {
          console.log('❌ No auth data found in localStorage');
        }
      };
    }
  }, [notifyExtension]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      
      if (event.data.type === 'TUBEDAO_EXTENSION_READY') {
        console.log('TubeDAO extension content script is ready');
        
        // If we're already authenticated, resend auth data to extension
        if (authState.isAuthenticated && authState.token) {
          console.log('Resending auth data to extension...');
          notifyExtension(
            authState.token, 
            authState.address!, 
            authState.chainId!, 
            parseInt(localStorage.getItem('tubedao_expires_at') || '0')
          );
        }
      }
      
      if (event.data.type === 'TUBEDAO_AUTH_CONFIRMED') {
        console.log('Extension confirmed auth data received');
        // Clear any retry timeouts since we got confirmation
        document.body.setAttribute('data-auth-confirmed', 'true');
      }
      
      if (event.data.type === 'TUBEDAO_EXTENSION_PONG') {
        console.log('✅ Extension content script is responding!');
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [authState.isAuthenticated, authState.token, authState.address, authState.chainId, notifyExtension]);

  const clearError = useCallback(() => {
    setAuthState(prev => ({ ...prev, error: null }));
  }, []);

  return {
    ...authState,
    authenticate,
    logout,
    clearError,
  };
}
