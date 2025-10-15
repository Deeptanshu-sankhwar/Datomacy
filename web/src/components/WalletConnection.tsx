'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Button } from '@/components/ui/button';
import { Wallet } from 'lucide-react';


export function WalletConnection() {

  // Note: Wallet registration is now handled by the authentication flow
  // This component only handles wallet connection UI

  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        const ready = mounted && authenticationStatus !== 'loading';
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus ||
            authenticationStatus === 'authenticated');

        return (
          <div
            {...(!ready && {
              'aria-hidden': true,
              'style': {
                opacity: 0,
                pointerEvents: 'none',
                userSelect: 'none',
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <Button
                    onClick={openConnectModal}
                      data-testid="connect-wallet"
                    className="bg-muted/50 border border-border text-foreground hover:bg-muted hover:border-border/80 px-6 py-3 text-sm font-medium shadow-lg transition-all duration-300"
                  >
                    <Wallet className="w-4 h-4 mr-2" />
                    Connect Wallet
                  </Button>
                );
              }

              if (chain.unsupported) {
                return (
                  <Button
                    onClick={openChainModal}
                    className="bg-primary/20 border border-primary/40 text-primary hover:bg-primary/30 px-6 py-3 text-sm font-medium backdrop-blur-md shadow-lg transition-all duration-300"
                  >
                    Wrong network
                  </Button>
                );
              }

              return (
                <div className="flex items-center gap-3 bg-green-500/10 backdrop-blur-lg rounded-xl p-3 border border-green-500/30">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-green-400 font-medium text-sm">
                      {account.displayName}
                    </span>
                  </div>
                  <Button
                    onClick={openAccountModal}
                    variant="outline"
                    size="sm"
                    className="border-primary/30 text-primary hover:bg-primary/10 text-xs px-3 py-1"
                  >
                    Disconnect
                  </Button>
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
} 

export default WalletConnection;
