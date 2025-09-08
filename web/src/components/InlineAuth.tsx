'use client';

import { useEffect } from 'react';
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
  return null;
}
