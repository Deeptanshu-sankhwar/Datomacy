"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { WaitlistForm } from '@/components/WaitlistForm';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Wallet, Menu, X, Mail, MessageCircle, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { submitWaitlistEntry } from '@/lib/waitlist';
import { ThemeToggle } from './ThemeToggle';

const WalletConnection = dynamic(
  () => import("@/components/WalletConnection").then((mod) => ({ default: mod.WalletConnection })),
  { 
    ssr: false,
    loading: () => (
      <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
        <Wallet className="h-4 w-4 mr-2" />
        Connect Wallet
      </Button>
    )
  }
);

interface LayoutProps {
  children: React.ReactNode;
  showExitIntent?: boolean;
}

export default function Layout({ children, showExitIntent = false }: LayoutProps) {
  const [scrollY, setScrollY] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
  const [showExitIntentModal, setShowExitIntentModal] = useState(false);
  const [hasShownExitIntent, setHasShownExitIntent] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  
  // Discord form state
  const [discordEmail, setDiscordEmail] = useState('');
  const [discordTelegram, setDiscordTelegram] = useState('');
  const [discordSubmitting, setDiscordSubmitting] = useState(false);
  const [discordStatus, setDiscordStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [discordMessage, setDiscordMessage] = useState('');

  // Discord form submit handler
  const handleDiscordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!discordEmail || !discordTelegram) {
      setDiscordStatus('error');
      setDiscordMessage('Please fill in both email and Telegram handle');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(discordEmail)) {
      setDiscordStatus('error');
      setDiscordMessage('Please enter a valid email address');
      return;
    }

    setDiscordSubmitting(true);
    setDiscordStatus('idle');

    try {
      const result = await submitWaitlistEntry({
        email: discordEmail,
        telegram: discordTelegram,
        source: 'Discord Exit Intent'
      });
      
      setDiscordStatus('success');
      setDiscordMessage(result.message);
      setDiscordEmail('');
      setDiscordTelegram('');
      
      // After successful submission, close modal and redirect to Discord
      setTimeout(() => {
        setShowExitIntentModal(false);
        window.open('https://discord.gg/GYqXDuqgp7', '_blank');
      }, 2000);
    } catch (error) {
      setDiscordStatus('error');
      setDiscordMessage(`Something went wrong. Please try again. ${error}`);
    } finally {
      setDiscordSubmitting(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      setMousePosition({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Exit intent detection (only on homepage)
  useEffect(() => {
    if (!showExitIntent) return;
    
    let timeoutId: NodeJS.Timeout;
    
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 50 && !hasShownExitIntent) {
        timeoutId = setTimeout(() => {
          setShowExitIntentModal(true);
          setHasShownExitIntent(true);
        }, 100);
      }
    };

    const handleMouseEnter = () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };

    document.documentElement.addEventListener("mouseleave", handleMouseLeave);
    document.documentElement.addEventListener("mouseenter", handleMouseEnter);
    
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      document.documentElement.removeEventListener("mouseleave", handleMouseLeave);
      document.documentElement.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [hasShownExitIntent, showExitIntent]);

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'How It Works', href: '/how-it-works' },
    { name: 'Why Datomacy', href: '/why-datomacy' },
    { name: 'Technology', href: '/technology' },
    { name: 'Join Waitlist', href: '/join-waitlist' }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      {/* Navigation Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-xl border-b border-border">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="text-xl sm:text-2xl font-black">
                <span className="bg-gradient-to-r from-primary via-primary/80 to-accent bg-clip-text text-transparent group-hover:from-primary/80 group-hover:via-accent group-hover:to-primary transition-all duration-300">
                  DATOMACY
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    pathname === item.href
                      ? 'bg-gradient-to-r from-primary/20 to-accent/20 text-foreground border border-primary/30'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Desktop Wallet + CTA */}
            <div className="hidden md:flex items-center space-x-4">
              <ThemeToggle />
              <WalletConnection />
              <WaitlistForm 
                variant="modal" 
                triggerText="Start Earning"
                triggerClassName="px-4 py-2 text-sm font-bold rounded-lg bg-gradient-to-r from-primary to-accent hover:from-primary/80 hover:to-accent/80 text-white shadow-lg hover:shadow-primary/25 transition-all duration-300 transform hover:scale-105"
              />
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-foreground hover:bg-muted/50 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-border">
              <div className="flex flex-col space-y-2">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                      pathname === item.href
                        ? 'bg-gradient-to-r from-primary/20 to-accent/20 text-foreground border border-primary/30'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
                <div className="pt-4 space-y-3">
                  <div className="flex justify-center">
                    <ThemeToggle />
                  </div>
                  <WalletConnection />
                  <WaitlistForm 
                    variant="modal" 
                    triggerText="Start Earning"
                    triggerClassName="w-full px-4 py-3 text-sm font-bold rounded-lg bg-gradient-to-r from-primary to-accent hover:from-primary/80 hover:to-accent/80 text-white shadow-lg hover:shadow-primary/25 transition-all duration-300"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Cursor-Responsive Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Main cursor-following gradient */}
        <div 
          className="absolute w-[800px] h-[800px] opacity-30 rounded-full blur-3xl transition-all duration-300 ease-out"
          style={{ 
            background: `radial-gradient(circle, rgba(239, 68, 68, 0.4) 0%, rgba(147, 51, 234, 0.3) 50%, rgba(236, 72, 153, 0.2) 100%)`,
            left: `${mousePosition.x}%`,
            top: `${mousePosition.y}%`,
            transform: `translate(-50%, -50%) scale(${1 + Math.sin(Date.now() * 0.001) * 0.1})`
          }}
        />
        
        {/* Secondary gradient that follows with delay */}
        <div 
          className="absolute w-[600px] h-[600px] opacity-20 rounded-full blur-3xl transition-all duration-700 ease-out"
          style={{ 
            background: `radial-gradient(circle, rgba(79, 70, 229, 0.4) 0%, rgba(219, 39, 119, 0.3) 50%, rgba(239, 68, 68, 0.2) 100%)`,
            left: `${mousePosition.x * 0.8 + 10}%`,
            top: `${mousePosition.y * 0.8 + 10}%`,
            transform: `translate(-50%, -50%) rotate(${mousePosition.x * 0.1}deg)`
          }}
        />
        
        {/* Scroll-responsive orbs */}
        <div 
          className="absolute w-96 h-96 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full blur-3xl" 
          style={{ 
            left: '10%',
            top: '20%',
            transform: `translateY(${scrollY * 0.3}px) scale(${1 + mousePosition.x * 0.002})`
          }}
        />
        <div 
          className="absolute w-80 h-80 bg-gradient-to-br from-accent/10 to-primary/10 rounded-full blur-3xl" 
          style={{ 
            right: '10%',
            top: '60%',
            transform: `translateY(${scrollY * -0.2}px) scale(${1 + mousePosition.y * 0.002})`
          }}
        />
        <div 
          className="absolute w-72 h-72 bg-gradient-to-br from-accent/10 to-primary/10 rounded-full blur-3xl" 
          style={{ 
            left: '50%',
            bottom: '20%',
            transform: `translateX(-50%) translateY(${scrollY * 0.4}px) scale(${1 + (mousePosition.x + mousePosition.y) * 0.001})`
          }}
        />
      </div>

      {/* Main Content */}
      <main className="relative z-10 pt-16 sm:pt-20">
        {children}
      </main>

      {/* Floating Waitlist Button */}
      <div className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-50">
        <div className="relative">
          {/* Multiple breathing glow layers */}
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full blur-2xl opacity-40 scale-150" style={{
            animation: 'breathe 2s ease-in-out infinite'
          }}></div>
          <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-full blur-xl opacity-30 scale-125" style={{
            animation: 'breathe 2.5s ease-in-out infinite reverse'
          }}></div>
          
          <WaitlistForm 
            variant="modal" 
            triggerText="Start Earning"
            triggerClassName="relative px-6 sm:px-8 lg:px-10 py-4 sm:py-5 lg:py-7 text-base sm:text-lg lg:text-xl font-black rounded-full shadow-2xl hover:scale-110 transition-all duration-300"
          />
        </div>
      </div>

      {/* Exit Intent Popup */}
      {showExitIntent && (
        <Dialog open={showExitIntentModal} onOpenChange={setShowExitIntentModal}>
          <DialogContent className="sm:max-w-md bg-black/95 backdrop-blur-xl border border-primary/50 p-6">
            <div className="text-center">
              <div className="mb-6">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-primary to-accent rounded-xl flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                    </svg>
                  </div>
                </div>
                <h3 className="text-3xl font-black text-white mb-3">Wait, Before You Go</h3>
                <p className="text-primary font-bold text-lg">Don&apos;t Miss Out on Insider Access</p>
              </div>
              
              <div className="bg-gradient-to-br from-primary/10 to-accent/5 backdrop-blur-xl border border-primary/20 rounded-lg p-6 mb-6">
                <div className="text-center mb-4">
                  <h4 className="text-white font-bold text-xl">Join Our Inner Circle</h4>
                </div>
                <p className="text-gray-300 text-base leading-relaxed">
                  Get <span className="text-primary font-bold">exclusive early access</span> to new features,
                  <span className="text-primary font-bold"> priority rewards</span>, and be the first to know about
                  <span className="text-white font-bold"> major product updates</span> in our private Discord community.
                </p>
              </div>
              
              <form onSubmit={handleDiscordSubmit} className="space-y-6 mb-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="discord-email" className="text-white text-sm font-medium mb-2 block">
                      Email Address
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="discord-email"
                        type="email"
                        value={discordEmail}
                        onChange={(e) => setDiscordEmail(e.target.value)}
                        placeholder="your@email.com"
                        className="pl-10 bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-primary focus:ring-1 focus:ring-primary/50"
                        disabled={discordSubmitting}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="discord-telegram" className="text-white text-sm font-medium mb-2 block">
                      Telegram Handle
                    </Label>
                    <div className="relative">
                      <MessageCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="discord-telegram"
                        type="text"
                        value={discordTelegram}
                        onChange={(e) => setDiscordTelegram(e.target.value)}
                        placeholder="@username"
                        className="pl-10 bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-primary focus:ring-1 focus:ring-primary/50"
                        disabled={discordSubmitting}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center p-3 bg-white/5 rounded-lg">
                    <div className="w-8 h-8 bg-primary/20 rounded-lg mx-auto mb-2 flex items-center justify-center">
                      <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <p className="text-gray-300 text-xs font-medium">Early Access</p>
                  </div>
                  <div className="text-center p-3 bg-white/5 rounded-lg">
                    <div className="w-8 h-8 bg-primary/20 rounded-lg mx-auto mb-2 flex items-center justify-center">
                      <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                    </div>
                    <p className="text-gray-300 text-xs font-medium">Priority Rewards</p>
                  </div>
                  <div className="text-center p-3 bg-white/5 rounded-lg">
                    <div className="w-8 h-8 bg-primary/20 rounded-lg mx-auto mb-2 flex items-center justify-center">
                      <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4 3h5v5l-5-5zM9 1v2m0 14v2m-7-7h2m14 0h2" />
                      </svg>
                    </div>
                    <p className="text-gray-300 text-xs font-medium">Product Updates</p>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={discordSubmitting}
                  className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/80 hover:to-accent/80 text-white font-black py-4 px-6 rounded-lg shadow-2xl hover:shadow-primary/25 transition-all duration-300 transform hover:scale-[1.02] text-base mb-4 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {discordSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Joining...
                    </>
                  ) : (
                    'Join Discord Community'
                  )}
                </Button>

                {/* Status Message */}
                {discordStatus !== 'idle' && (
                  <div className={`text-center p-3 rounded-lg text-sm ${
                    discordStatus === 'success' 
                      ? 'bg-green-500/20 text-green-300' 
                      : 'bg-primary/20 text-primary/80'
                  }`}>
                    {discordStatus === 'success' ? (
                      <div className="flex items-center justify-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        {discordMessage} - Redirecting to Discord...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        {discordMessage}
                      </div>
                    )}
                  </div>
                )}
              </form>
              
              <button 
                onClick={() => setShowExitIntentModal(false)}
                className="text-gray-400 hover:text-white text-sm underline transition-colors"
              >
                No thanks, I&apos;ll stay out of the loop
              </button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      <style jsx>{`
        @keyframes breathe {
          0%, 100% { 
            transform: scale(1);
            opacity: 0.4;
          }
          50% { 
            transform: scale(1.2);
            opacity: 0.8;
          }
        }
      `}</style>
    </div>
  );
}
