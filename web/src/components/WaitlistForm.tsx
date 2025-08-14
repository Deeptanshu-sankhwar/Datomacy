'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { 
  Mail, 
  MessageCircle, 
  CheckCircle, 
  AlertCircle, 
  Loader2,
  Shield,
  Lock,
  Zap
} from 'lucide-react';
import { submitWaitlistEntry } from '@/lib/waitlist';

interface WaitlistFormProps {
  className?: string;
  variant?: 'hero' | 'card' | 'minimal' | 'modal';
  triggerText?: string;
  triggerClassName?: string;
  children?: React.ReactNode;
}

export function WaitlistForm({ 
  className = '', 
  variant = 'hero', 
  triggerText = "Join Waitlist",
  triggerClassName = "",
  children
}: WaitlistFormProps) {
  const [email, setEmail] = useState('');
  const [telegram, setTelegram] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !telegram) {
      setStatus('error');
      setMessage('Please fill in both email and Telegram handle');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setStatus('error');
      setMessage('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);
    setStatus('idle');

    try {
      const result = await submitWaitlistEntry({
        email,
        telegram,
        source: 'Website'
      });

      if (result.success) {
        setStatus('success');
        setMessage(result.message);
        setEmail('');
        setTelegram('');
      } else {
        setStatus('error');
        setMessage('Failed to join waitlist. Please try again.');
      }
    } catch (error) {
      setStatus('error');
      setMessage(`Something went wrong. Please try again. ${error}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderHeroVariant = () => (
    <div className={`text-center space-y-6 ${className}`}>
      <div className="text-center">
        <p className="text-gray-300">Be among the first to access TubeDAO</p>
        <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-lg p-3 mt-3 mb-2">
          <p className="text-yellow-300 font-semibold text-sm">
            First 300 users get exclusive token airdrop
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4">
        <div className="space-y-4">
          <div>
            <Label htmlFor="email" className="text-white text-sm font-medium">
              Email Address
            </Label>
            <div className="relative mt-2">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="pl-10 bg-white/10 border-white/20 text-white placeholder-gray-400"
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="telegram" className="text-white text-sm font-medium">
              Telegram Handle
            </Label>
            <div className="relative mt-2">
              <MessageCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="telegram"
                type="text"
                value={telegram}
                onChange={(e) => setTelegram(e.target.value)}
                placeholder="@username or t.me/username"
                className="pl-10 bg-white/10 border-white/20 text-white placeholder-gray-400"
                disabled={isSubmitting}
              />
            </div>
          </div>
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-red-500 to-purple-600 hover:from-red-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Joining Waitlist...
            </>
          ) : (
            'Join Waitlist'
          )}
        </Button>

        {status !== 'idle' && (
          <div className={`flex items-center justify-center gap-2 text-sm ${
            status === 'success' ? 'text-green-400' : 'text-red-400'
          }`}>
            {status === 'success' ? (
              <CheckCircle className="w-4 h-4" />
            ) : (
              <AlertCircle className="w-4 h-4" />
            )}
            {message}
          </div>
        )}
      </form>
    </div>
  );

  const renderCardVariant = () => (
    <Card className={`bg-slate-800/60 border-slate-600/50 p-6 backdrop-blur-sm ${className}`}>
      <div className="text-center space-y-6">
        <div>
          <h3 className="text-xl font-bold text-white mb-2">Join the Waitlist</h3>
          <p className="text-slate-400 text-sm">Earn rewards by contributing your data to TubeDAO</p>
          <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-lg p-2 mt-2">
            <p className="text-yellow-300 font-semibold text-xs">
              First 300 users get token airdrop
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email-card" className="text-white text-sm">
              Email
            </Label>
            <Input
              id="email-card"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="bg-slate-700/50 border-slate-600/50 text-white"
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="telegram-card" className="text-white text-sm">
              Telegram
            </Label>
            <Input
              id="telegram-card"
              type="text"
              value={telegram}
              onChange={(e) => setTelegram(e.target.value)}
              placeholder="@username"
              className="bg-slate-700/50 border-slate-600/50 text-white"
              disabled={isSubmitting}
            />
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-red-500 to-purple-600"
          >
            {isSubmitting ? 'Joining...' : 'Join Waitlist'}
          </Button>
        </form>

        {status !== 'idle' && (
          <div className={`text-sm ${status === 'success' ? 'text-green-400' : 'text-red-400'}`}>
            {message}
          </div>
        )}
      </div>
    </Card>
  );

  const renderMinimalVariant = () => (
    <form onSubmit={handleSubmit} className={`flex flex-col sm:flex-row gap-3 ${className}`}>
      <Input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        className="bg-white/10 border-white/20 text-white"
        disabled={isSubmitting}
      />
      <Input
        type="text"
        value={telegram}
        onChange={(e) => setTelegram(e.target.value)}
        placeholder="Telegram @username"
        className="bg-white/10 border-white/20 text-white"
        disabled={isSubmitting}
      />
      <Button
        type="submit"
        disabled={isSubmitting}
        className="bg-gradient-to-r from-red-500 to-purple-600"
      >
        {isSubmitting ? 'Joining...' : 'Join'}
      </Button>
    </form>
  );

  const renderModalVariant = () => (
    <Dialog>
      <DialogTrigger asChild>
        {children ? (
          <div>{children}</div>
        ) : (
          <Button className={`relative overflow-hidden bg-gradient-to-r from-red-500 via-purple-500 to-pink-500 hover:from-red-600 hover:via-purple-600 hover:to-pink-600 text-white font-bold py-4 px-8 rounded-xl text-lg shadow-xl hover:shadow-purple-500/50 transition-all duration-300 transform hover:scale-105 ${triggerClassName}`}>
            <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 hover:opacity-100 transition-opacity"></div>
            <div className="relative z-10 flex items-center gap-2">
              {triggerText}
            </div>
          </Button>
        )}
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-lg bg-black/95 backdrop-blur-xl border border-gray-600/50 p-8">
        <div>
            {/* Header */}
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-3">
                Join the Waitlist
              </h2>
              <p className="text-gray-400 text-sm">Get early access to TubeDAO chrome extension to start earning rewards and exclusive token airdrop</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="modal-email" className="text-white text-sm font-medium mb-2 block">
                    Email Address
                  </Label>
                  <Input
                    id="modal-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 text-white placeholder-gray-400 rounded-lg focus:border-purple-400 focus:ring-1 focus:ring-purple-400/50 transition-colors"
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <Label htmlFor="modal-telegram" className="text-white text-sm font-medium mb-2 block">
                    Telegram Handle
                  </Label>
                  <Input
                    id="modal-telegram"
                    type="text"
                    value={telegram}
                    onChange={(e) => setTelegram(e.target.value)}
                    placeholder="@username"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 text-white placeholder-gray-400 rounded-lg focus:border-purple-400 focus:ring-1 focus:ring-purple-400/50 transition-colors"
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full relative overflow-hidden bg-gradient-to-r from-red-500 to-purple-600 hover:from-red-600 hover:to-purple-700 text-white font-bold py-4 px-6 rounded-lg shadow-lg hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex items-center justify-center">
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Joining Waitlist...
                    </>
                  ) : (
                    <>
                      <span>Join Waitlist</span>
                      <div className="ml-2 w-5 h-5 bg-white/20 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                    </>
                  )}
                </div>
              </Button>

              {/* Status Message */}
              {status !== 'idle' && (
                <div className={`text-center p-3 rounded-lg text-sm ${
                  status === 'success' 
                    ? 'bg-green-500/20 text-green-300' 
                    : 'bg-red-500/20 text-red-300'
                }`}>
                  {status === 'success' ? (
                    <div className="flex items-center justify-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      Successfully joined!
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      {message}
                    </div>
                  )}
                </div>
              )}
            </form>

            {/* Trust Indicators */}
            <div className="flex items-center justify-center gap-6 mt-6 text-xs text-gray-400">
              <div className="flex items-center gap-1">
                <Shield className="w-3 h-3 text-green-400" />
                <span>Privacy Protected</span>
              </div>
              <div className="flex items-center gap-1">
                <Lock className="w-3 h-3 text-blue-400" />
                <span>Zero-Knowledge Powered</span>
              </div>
              <div className="flex items-center gap-1">
                <Zap className="w-3 h-3 text-yellow-400" />
                <span>Earn Rewards</span>
              </div>
            </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  switch (variant) {
    case 'card':
      return renderCardVariant();
    case 'minimal':
      return renderMinimalVariant();
    case 'modal':
      return renderModalVariant();
    default:
      return renderHeroVariant();
  }
}