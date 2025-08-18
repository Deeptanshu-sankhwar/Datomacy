"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { WaitlistForm } from '@/components/WaitlistForm';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Button } from "@/components/ui/button";
import { Wallet, Menu, X } from "lucide-react";

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
    { name: 'Why TubeDAO', href: '/why-tubedao' },
    { name: 'Technology', href: '/technology' },
    { name: 'Join Waitlist', href: '/join-waitlist' }
  ];

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Navigation Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/10">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="text-xl sm:text-2xl font-black">
                <span className="bg-gradient-to-r from-white via-red-200 to-pink-200 bg-clip-text text-transparent group-hover:from-red-400 group-hover:via-pink-400 group-hover:to-purple-400 transition-all duration-300">
                  TUBE
                </span>
                <span className="bg-gradient-to-r from-red-400 via-pink-400 to-purple-400 bg-clip-text text-transparent group-hover:from-white group-hover:via-red-200 group-hover:to-pink-200 transition-all duration-300">
                  DAO
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
                      ? 'bg-gradient-to-r from-red-500/20 to-purple-500/20 text-white border border-red-500/30'
                      : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Desktop Wallet + CTA */}
            <div className="hidden md:flex items-center space-x-4">
              <WalletConnection />
              <WaitlistForm 
                variant="modal" 
                triggerText="Start Earning"
                triggerClassName="px-4 py-2 text-sm font-bold rounded-lg bg-gradient-to-r from-red-500 to-purple-600 hover:from-red-600 hover:to-purple-700 text-white shadow-lg hover:shadow-red-500/25 transition-all duration-300 transform hover:scale-105"
              />
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-white hover:bg-white/10 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-white/10">
              <div className="flex flex-col space-y-2">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                      pathname === item.href
                        ? 'bg-gradient-to-r from-red-500/20 to-purple-500/20 text-white border border-red-500/30'
                        : 'text-gray-300 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
                <div className="pt-4 space-y-3">
                  <WalletConnection />
                  <WaitlistForm 
                    variant="modal" 
                    triggerText="Start Earning"
                    triggerClassName="w-full px-4 py-3 text-sm font-bold rounded-lg bg-gradient-to-r from-red-500 to-purple-600 hover:from-red-600 hover:to-purple-700 text-white shadow-lg hover:shadow-red-500/25 transition-all duration-300"
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
          className="absolute w-96 h-96 bg-gradient-to-br from-red-500/10 to-purple-500/10 rounded-full blur-3xl" 
          style={{ 
            left: '10%',
            top: '20%',
            transform: `translateY(${scrollY * 0.3}px) scale(${1 + mousePosition.x * 0.002})`
          }}
        />
        <div 
          className="absolute w-80 h-80 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-3xl" 
          style={{ 
            right: '10%',
            top: '60%',
            transform: `translateY(${scrollY * -0.2}px) scale(${1 + mousePosition.y * 0.002})`
          }}
        />
        <div 
          className="absolute w-72 h-72 bg-gradient-to-br from-pink-500/10 to-red-500/10 rounded-full blur-3xl" 
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
          <div className="absolute inset-0 bg-gradient-to-r from-red-400 to-pink-500 rounded-full blur-xl opacity-30 scale-125" style={{
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
          <DialogContent className="sm:max-w-md bg-black/95 backdrop-blur-xl border border-red-500/50 p-6">
            <div className="text-center">
              <div className="mb-4">
                <h3 className="text-2xl font-bold text-white mb-2">Wait! Don&apos;t Miss Out</h3>
                <p className="text-red-400 font-bold text-lg">Exclusive Token Airdrop Ending Soon</p>
              </div>
              
              <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 mb-6">
                <p className="text-white font-bold mb-2">LIMITED TIME:</p>
                <p className="text-gray-300 text-sm">
                  Only <span className="text-red-400 font-bold">47 spots left</span> for the exclusive TDAO token airdrop. 
                  First 300 users get <span className="text-green-400 font-bold">free tokens at launch</span> - no purchase required.
                </p>
              </div>
              
              <div className="mb-6">
                <div className="text-3xl font-black text-red-400 mb-2">47</div>
                <p className="text-gray-300 text-sm">airdrop spots remaining</p>
              </div>
              
              <WaitlistForm 
                variant="modal" 
                triggerText="Claim My Free Airdrop"
                triggerClassName="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-black py-4 px-6 rounded-lg shadow-2xl hover:shadow-red-500/50 transition-all duration-300 transform hover:scale-105 text-sm mb-4"
              />
              
              <button 
                onClick={() => setShowExitIntentModal(false)}
                className="text-gray-400 hover:text-white text-sm underline"
              >
                No thanks, I&apos;ll pass on free tokens
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
