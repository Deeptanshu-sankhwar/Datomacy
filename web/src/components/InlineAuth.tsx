'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Shield, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useAccount } from 'wagmi';

export function InlineAuth() {
  const { 
    isAuthenticated, 
    isLoading, 
    error, 
    needsRegistration,
    isProcessingRegistration,
    authenticate, 
    clearError
  } = useAuth();
  
  const { isConnected } = useAccount();

  useEffect(() => {
    if (isConnected && !isAuthenticated && !isLoading && !error && !needsRegistration && !isProcessingRegistration) {
      const timer = setTimeout(() => {
        authenticate();
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [isConnected, isAuthenticated, isLoading, error, needsRegistration, isProcessingRegistration, authenticate]);

  if (isAuthenticated) {
    return (
      <Button 
        size="lg" 
        className="bg-gradient-to-r from-green-600 to-green-500 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg"
        disabled
      >
        <CheckCircle className="w-5 h-5 mr-2" />
        Authenticated
      </Button>
    );
  }

  if (!isConnected) {
    return (
      <Button 
        size="lg" 
        className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-red-500/25 transition-all duration-300"
        onClick={() => {
          const connectButton = document.querySelector('[data-testid="connect-wallet"]') as HTMLButtonElement;
          if (connectButton) {
            connectButton.click();
          }
        }}
      >
        <Shield className="w-5 h-5 mr-2" />
        Connect Wallet
      </Button>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center gap-3">
        <Button 
          size="lg" 
          className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-red-500/25 transition-all duration-300"
          onClick={authenticate}
        >
          <Shield className="w-5 h-5 mr-2" />
          Try Again
        </Button>
        <div className="flex items-center gap-2 text-red-400 text-sm">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={clearError}
            className="text-red-400 hover:text-red-300 p-1 h-auto"
          >
            ×
          </Button>
        </div>
      </div>
    );
  }

  if (isLoading || isProcessingRegistration) {
    return (
      <div className="flex flex-col items-center gap-3">
        <Button 
          size="lg" 
          className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg"
          disabled
        >
          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
          {isProcessingRegistration ? 'Processing Registration...' : 'Authenticating...'}
        </Button>
        {isProcessingRegistration && (
          <p className="text-blue-400 text-sm text-center max-w-xs">
            Your Moksha registration is being processed. This may take a few minutes.
          </p>
        )}
      </div>
    );
  }

  if (needsRegistration) {
    return (
      <div className="flex flex-col items-center gap-3">
        <Button 
          size="lg" 
          className="bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-purple-500/25 transition-all duration-300"
          onClick={authenticate}
        >
          <Shield className="w-5 h-5 mr-2" />
          Complete Registration
        </Button>
        <p className="text-purple-400 text-sm text-center max-w-xs">
          You'll need to register on the Vana Moksha network. Our relayer will handle this automatically.
        </p>
      </div>
    );
  }

  return (
    <Button 
      size="lg" 
      className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg"
      disabled
    >
      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
      Starting Authentication...
    </Button>
  );
}
