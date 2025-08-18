"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent } from "@/components/ui/dialog";

import dynamic from 'next/dynamic';
import { WaitlistForm } from '@/components/WaitlistForm';

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
import { 
  Play, 
  Users, 
  Shield, 
  Upload,
  Coins,
  FileText,
  CheckCircle,
  Target,
  Lock,
  Eye,
  Sparkles,
  Layers,
  Brain,
  Wallet,
  ChevronDown,
  ExternalLink,
  Github,
  Twitter,
  MessageCircle
} from "lucide-react";

export default function TubeDAO() {
  const [scrollY, setScrollY] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
  const [showExitIntent, setShowExitIntent] = useState(false);
  const [hasShownExitIntent, setHasShownExitIntent] = useState(false);

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

  // Exit intent detection
  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !hasShownExitIntent) {
        setShowExitIntent(true);
        setHasShownExitIntent(true);
      }
    };

    document.addEventListener("mouseleave", handleMouseLeave);
    return () => document.removeEventListener("mouseleave", handleMouseLeave);
  }, [hasShownExitIntent]);



  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
  };



  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Header with Wallet Connection */}
      <header className="fixed top-0 right-0 z-50 p-6">
        <WalletConnection />
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

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6">
        <div className="container mx-auto text-center max-w-6xl relative z-10">
          <div className="flex justify-center items-center mb-6 sm:mb-8">
            <WaitlistForm 
              variant="modal" 
              triggerText=""
              triggerClassName="bg-transparent p-0 hover:bg-transparent shadow-none"
            >
              <div className="relative cursor-pointer">
                {/* Breathing glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/50 to-orange-500/50 rounded-full blur-lg animate-pulse scale-110"></div>
                
                <Badge className="relative bg-gradient-to-r from-yellow-500/40 to-orange-500/40 text-yellow-100 border-yellow-400/60 px-3 sm:px-6 lg:px-8 py-2 sm:py-3 lg:py-4 text-xs sm:text-sm lg:text-lg font-black shadow-2xl shadow-yellow-500/30 hover:scale-105 transition-transform duration-300 header-breathe cursor-pointer">
                  <Coins className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 mr-2 sm:mr-3 animate-bounce" />
                  <span className="hidden sm:inline">GET PAID TO WATCH YOUTUBE • EARLY ACCESS BONUS</span>
                  <span className="sm:hidden">GET PAID TO WATCH YOUTUBE</span>
                </Badge>
              </div>
            </WaitlistForm>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-black mb-6 sm:mb-8 tracking-tight">
            <span className="bg-gradient-to-r from-white via-red-200 to-pink-200 bg-clip-text text-transparent">
              TUBE
            </span>
            <span className="bg-gradient-to-r from-red-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
              DAO
            </span>
          </h1>
          
          <div className="max-w-4xl mx-auto mb-8 sm:mb-12 space-y-4 sm:space-y-6">
            <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-gray-300 mb-4 sm:mb-6 font-light leading-relaxed">
              <span className="text-red-400 font-bold">Finally! Get Paid for What You&apos;re Already Doing on YouTube</span>
            </p>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-400 font-light leading-relaxed">
              You&apos;ve been watching YouTube for years, making billions for others.<br />
              <span className="text-white font-medium">It&apos;s time you got your share. Join hundreds of smart viewers in earning TDAO tokens just by watching YouTube like you always do.</span>
            </p>
            
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 mt-6 sm:mt-8 text-xs sm:text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <Shield className="w-3 h-3 sm:w-4 sm:h-4 text-green-400" />
                <span>Privacy Protected</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock className="w-3 h-3 sm:w-4 sm:h-4 text-blue-400" />
                <span>Zero-Knowledge Powered</span>
              </div>
              <div className="flex items-center gap-2">
                <Coins className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400" />
                <span>Earn Rewards</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col gap-4 sm:gap-6 lg:gap-8 justify-center items-center mb-12 sm:mb-16 max-w-4xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-center justify-center w-full">
              <WaitlistForm 
                variant="modal" 
                triggerText="Start Earning TDAO Tokens"
                triggerClassName="text-base sm:text-lg lg:text-xl px-8 sm:px-10 lg:px-12 py-4 sm:py-5 lg:py-6 w-full sm:w-auto"
              />
              
              <Button 
                size="lg" 
                onClick={() => scrollToSection('how-it-works')}
                className="bg-white/15 border border-white/50 text-white hover:bg-white/25 hover:border-white/70 px-6 sm:px-8 py-4 text-base sm:text-lg font-semibold backdrop-blur-md shadow-xl hover:shadow-2xl transition-all duration-300 w-full sm:w-auto"
              >
                <Play className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                See How You Earn
              </Button>
            </div>
          </div>
          
          <p className="text-gray-500 text-xs sm:text-sm">
            <Lock className="w-3 h-3 sm:w-4 sm:h-4 inline mr-2" />
            Privacy Protected • No Spam • Zero-Knowledge Powered
          </p>
          
          {/* Scroll indicator */}
          <div className="absolute bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <ChevronDown className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400" />
          </div>
        </div>
      </section>

      {/* Benefits Section - Moved Higher */}
      <section className="py-16 sm:py-24 lg:py-32 bg-gradient-to-b from-purple-900/10 to-gray-900/20 relative">
        <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
          {/* Urgency Counter */}
          <div className="text-center mb-8 sm:mb-12">
            <div className="inline-flex items-center gap-4 bg-red-500/20 border border-red-500/30 rounded-full px-6 py-3 mb-6">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-white font-bold text-sm sm:text-base">LIVE: 47 spots remaining for exclusive airdrop</span>
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-6 sm:mb-8 text-white">
              Start Earning From <span className="text-green-400">Your YouTube Habits</span> Today
            </h2>
            <p className="text-lg sm:text-xl lg:text-2xl text-gray-300 max-w-3xl mx-auto">
              You watch YouTube every day. <span className="text-white font-bold">Now get paid for it.</span>
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12">
            <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/5 backdrop-blur-xl border border-green-500/20 p-6 sm:p-8 hover:border-green-400/50 transition-all duration-500 hover:scale-[1.02] shadow-2xl">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                  <Coins className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white">You Earn Passive Income</h3>
              </div>
              <p className="text-gray-300 text-base sm:text-lg leading-relaxed mb-4">
                <span className="text-white font-bold">You make money</span> while binge-watching your favorite creators. You can earn <span className="text-green-400 font-bold">$15-50+ monthly</span> in TDAO tokens just by watching YouTube.
              </p>
              <p className="text-green-400 font-medium text-sm sm:text-base">You earn $180-600+ annually for doing exactly what you already do.</p>
              
              {/* Earnings Calculator */}
              <div className="mt-4 p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                <h4 className="text-green-400 font-bold text-sm mb-2">Your Potential Earnings:</h4>
                <div className="space-y-1 text-xs text-gray-300">
                  <div className="flex justify-between"><span>1 hour daily:</span><span className="text-green-400 font-bold">~$12/month</span></div>
                  <div className="flex justify-between"><span>3 hours daily:</span><span className="text-green-400 font-bold">~$35/month</span></div>
                  <div className="flex justify-between"><span>5+ hours daily:</span><span className="text-green-400 font-bold">~$50+/month</span></div>
                </div>
              </div>
            </Card>
            
            <Card className="bg-gradient-to-br from-yellow-500/10 to-orange-500/5 backdrop-blur-xl border border-yellow-500/20 p-6 sm:p-8 hover:border-yellow-400/50 transition-all duration-500 hover:scale-[1.02] shadow-2xl">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white">You Get Your Fair Share</h3>
              </div>
              <p className="text-gray-300 text-base sm:text-lg leading-relaxed mb-4">
                YouTube made <span className="text-yellow-400 font-bold">$28.8 billion from ads</span> last year. Creators got paid. Advertisers got results. <span className="text-white font-bold">You got nothing.</span>
              </p>
              <p className="text-yellow-400 font-medium text-sm sm:text-base">Now you get compensated for the valuable data you create every day.</p>
              
              {/* CTA within benefit */}
              <div className="mt-4">
                <WaitlistForm 
                  variant="modal" 
                  triggerText="Start Getting Paid Now"
                  triggerClassName="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black font-bold py-3 px-6 rounded-lg shadow-lg hover:shadow-yellow-500/25 transition-all duration-300 transform hover:scale-[1.02] text-sm"
                />
              </div>
            </Card>
            
            <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/5 backdrop-blur-xl border border-blue-500/20 p-6 sm:p-8 hover:border-blue-400/50 transition-all duration-500 hover:scale-[1.02] shadow-2xl">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white">You Keep Full Privacy</h3>
              </div>
              <p className="text-gray-300 text-base sm:text-lg leading-relaxed mb-4">
                <span className="text-white font-bold">You control your data completely.</span> We never track your personal info or sell your identity. Your raw data stays 100% private.
              </p>
              <p className="text-blue-400 font-medium text-sm sm:text-base">You get paid every time your anonymous insights create value.</p>
            </Card>
            
            <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/5 backdrop-blur-xl border border-purple-500/20 p-6 sm:p-8 hover:border-purple-400/50 transition-all duration-500 hover:scale-[1.02] shadow-2xl">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white">You Control Your Data's Future</h3>
              </div>
              <p className="text-gray-300 text-base sm:text-lg leading-relaxed mb-4">
                <span className="text-white font-bold">You vote on how your data gets used.</span> As a TDAO token holder, you have real decision-making power.
              </p>
              <p className="text-purple-400 font-medium text-sm sm:text-base">You'll never be powerless while tech giants profit from your information again.</p>
              
              {/* CTA within benefit */}
              <div className="mt-4">
                <WaitlistForm 
                  variant="modal" 
                  triggerText="Claim Your Power"
                  triggerClassName="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-[1.02] text-sm"
                />
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Demo Video Section */}
      <section className="py-16 sm:py-24 lg:py-32 relative bg-gradient-to-b from-transparent via-gray-900/10 to-transparent">
        <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-4 sm:mb-6 text-white">
              Watch How It Works
            </h2>
            <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed px-4">
              See our Chrome extension capture real-time YouTube data and how users maintain complete control over their digital footprint.
            </p>
          </div>
          
          <div className="relative group">
            {/* Video Player Container with Enhanced Floating Animation */}
            <div className="relative bg-gradient-to-br from-gray-900/40 to-gray-800/20 backdrop-blur-xl rounded-3xl border border-gray-700/50 overflow-hidden shadow-2xl hover:shadow-purple-500/20 transition-all duration-700 hover:border-purple-500/30 hover:scale-[1.02] animate-pulse hover:animate-none group-hover:shadow-purple-500/30">
              {/* Floating Orbs for Animation */}
              <div className="absolute -top-4 -left-4 w-8 h-8 bg-purple-500/30 rounded-full blur-sm animate-bounce"></div>
              <div className="absolute -top-6 -right-6 w-6 h-6 bg-pink-500/40 rounded-full blur-sm animate-bounce delay-1000"></div>
              <div className="absolute -bottom-4 -left-6 w-10 h-10 bg-red-500/20 rounded-full blur-sm animate-bounce delay-500"></div>
              
              {/* Decorative Corner Elements */}
              <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-purple-500/20 to-transparent rounded-br-full animate-pulse"></div>
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-pink-500/20 to-transparent rounded-tl-full animate-pulse delay-1000"></div>
              
              {/* Loom Video Embed */}
              <div className="relative p-4 md:p-8">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                  <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
                    <iframe 
                      src="https://www.loom.com/embed/72511ad65cbb43d48d0be3376fe22c58?sid=38e65391-04f1-4148-8616-8bedfbd976e5" 
                      frameBorder="0" 
                      allowFullScreen
                      style={{ 
                        position: 'absolute', 
                        top: 0, 
                        left: 0, 
                        width: '100%', 
                        height: '100%',
                        borderRadius: '1rem'
                      }}
                      className="rounded-2xl"
                    />
                  </div>
                </div>
                
                {/* Subtle Gradient Overlay */}
                <div className="absolute inset-4 md:inset-8 rounded-2xl pointer-events-none">
                  <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 opacity-80 animate-pulse"></div>
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-red-500 via-pink-500 to-purple-500 opacity-80 animate-pulse delay-500"></div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Key Features Highlighted */}
          <div className="mt-16 sm:mt-20 lg:mt-24 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="text-center group">
              <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-purple-500/25">
                <Shield className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white mb-2">Privacy First</h3>
              <p className="text-gray-400 text-sm">Data stays local until you choose to contribute</p>
            </div>
            
            <div className="text-center group">
              <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-pink-500/25">
                <Brain className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white mb-2">Real-Time Capture</h3>
              <p className="text-gray-400 text-sm">Live behavioral data as you browse YouTube</p>
            </div>
            
            <div className="text-center group sm:col-span-2 lg:col-span-1">
              <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-red-500/25">
                <Coins className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white mb-2">Earn Rewards</h3>
              <p className="text-gray-400 text-sm">Get tokens when your data creates value</p>
            </div>
          </div>
        </div>
      </section>

      {/* What's TubeDAO */}
      <section className="py-16 sm:py-24 lg:py-32 relative bg-gradient-to-b from-transparent to-gray-900/20">
        <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
          <div className="text-center mb-12 sm:mb-16 lg:mb-20">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-6 sm:mb-8 text-white">
              The Side Hustle You&apos;re Already Doing<br /><span className="text-gray-400">(Without Getting Paid)</span>
            </h2>
            <p className="text-lg sm:text-xl lg:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed px-4">
              Every video you watch generates <span className="text-yellow-400 font-bold">$240+ billion annually</span> for YouTube.<br className="hidden sm:block" />
              <span className="text-white font-medium">Now it&apos;s time you got your share.</span>
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            <Card className="bg-gradient-to-br from-gray-900/90 to-gray-800/50 backdrop-blur-xl border border-gray-700/50 p-8 hover:border-gray-600/70 transition-all duration-500 group hover:scale-[1.02] shadow-2xl">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Upload className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">Contribute Your Data</h3>
                  <p className="text-gray-400 text-sm">Dual-source data collection</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="bg-blue-500/10 rounded-lg p-4 border border-blue-500/20">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                      <FileText className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-blue-400 font-semibold">Google Takeout</span>
                  </div>
                  <p className="text-gray-300 text-sm">Historical watch patterns, subscriptions, and search data</p>
                </div>
                
                <div className="bg-purple-500/10 rounded-lg p-4 border border-purple-500/20">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                      <Brain className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-purple-400 font-semibold">Chrome Extension</span>
                  </div>
                  <p className="text-gray-300 text-sm">Real-time Premium features and ad interaction metrics</p>
                </div>
              </div>
            </Card>
            
            <Card className="bg-gradient-to-br from-gray-900/90 to-gray-800/50 backdrop-blur-xl border border-gray-700/50 p-8 hover:border-gray-600/70 transition-all duration-500 group hover:scale-[1.02] shadow-2xl">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">Participate in Governance</h3>
                  <p className="text-gray-400 text-sm">Democratic data decisions</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="bg-cyan-500/10 rounded-lg p-4 border border-cyan-500/20">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-cyan-500 rounded-lg flex items-center justify-center">
                      <Target className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-cyan-400 font-semibold">Proposal Voting</span>
                  </div>
                  <p className="text-gray-300 text-sm">Vote on data licensing partnerships and usage policies</p>
                </div>
                
                <div className="bg-blue-500/10 rounded-lg p-4 border border-blue-500/20">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                      <Shield className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-blue-400 font-semibold">Snapshot Protocol</span>
                  </div>
                  <p className="text-gray-300 text-sm">Gas-free voting with full transparency and immutable records</p>
                </div>
              </div>
            </Card>
            
            <Card className="bg-gradient-to-br from-gray-900/90 to-gray-800/50 backdrop-blur-xl border border-gray-700/50 p-8 hover:border-gray-600/70 transition-all duration-500 group hover:scale-[1.02] shadow-2xl">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Coins className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">Earn Token Rewards</h3>
                  <p className="text-gray-400 text-sm">Value-based compensation</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="bg-yellow-500/10 rounded-lg p-4 border border-yellow-500/20">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center">
                      <Wallet className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-yellow-400 font-semibold">TubeDAO Tokens</span>
                  </div>
                  <p className="text-gray-300 text-sm">Earn tokens when your data is licensed to researchers and brands</p>
                </div>
                
                <div className="bg-orange-500/10 rounded-lg p-4 border border-orange-500/20">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-orange-400 font-semibold">Premium Multipliers</span>
                  </div>
                  <p className="text-gray-300 text-sm">Higher rewards for unique data patterns and longer contribution history</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Why It Matters */}
      <section className="py-32 bg-gradient-to-b from-gray-900/20 to-red-900/10 relative">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-black mb-8 text-white">
              Why It Matters
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-16">
            <div className="space-y-12">
              <div className="flex items-start space-x-6 group">
                <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-sm shadow-green-400/20">
                  <Shield className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-3">Unlock Unrivaled User Behavior Insights</h3>
                  <p className="text-gray-300 text-lg leading-relaxed">
                    Go beyond basic analytics. Our deep data reveals <em>how</em> users truly engage with YouTube, from Premium feature adoption to their nuanced interactions with ads, providing a competitive edge for brands and creators.
                  </p>
                  <p className="text-green-400 font-medium mt-2">✨ Granular insights previously unavailable</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-6 group">
                <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-sm shadow-purple-400/20">
                  <Eye className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-3">Empower Creators with Actionable Premium & Ad Intelligence</h3>
                  <p className="text-gray-300 text-lg leading-relaxed">
                    Help creators understand what paying subscribers truly value, and gain unprecedented insights into ad effectiveness and user tolerance, enabling smarter content and monetization strategies.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="space-y-12">
              <div className="flex items-start space-x-6 group">
                <div className="w-12 h-12 bg-yellow-400/20 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-sm shadow-yellow-400/30">
                  <Wallet className="w-6 h-6 text-yellow-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-3">Drive Fairer, User-Owned Digital Media</h3>
                  <p className="text-gray-300 text-lg leading-relaxed">
                    Shift power from platforms to users by giving them ownership and a share in the value derived from their comprehensive consumption data, fostering a more equitable and transparent digital ecosystem.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-6 group">
                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-sm shadow-blue-400/20">
                  <CheckCircle className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-3">Privacy-First via Vana&apos;s Secure Runtime</h3>
                  <p className="text-gray-300 text-lg leading-relaxed">
                    All data is anonymized and aggregated within Vana&apos;s Secure Runtime (TEEs). Your raw, personal data remains private, while collective insights are made available for ethical research and AI training.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* How It Works */}
      <section id="how-it-works" className="py-32 bg-gradient-to-b from-transparent to-purple-900/10 relative">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-black mb-8 text-white">
              From Zero to Earning in Less Than 5 Minutes
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              No technical knowledge required. Start earning from your YouTube habits today.
            </p>
          </div>
          
          {/* Visual Timeline */}
          <div className="relative">
            <div className="grid md:grid-cols-4 gap-8">
              {[
                { 
                  step: "01", 
                  title: "Connect & Get Started", 
                  desc: "Download our Chrome extension (takes 30 seconds)", 
                  icon: Wallet, 
                  detail: "Connect your wallet or create one - we'll walk you through it",
                  tooltip: "No technical knowledge required"
                },
                { 
                  step: "02", 
                  title: "Watch YouTube Like Always", 
                  desc: "Keep doing exactly what you're doing", 
                  icon: Play, 
                  detail: "Browse YouTube, watch videos, skip ads. Our extension captures the value while keeping your data private",
                  tooltip: "Zero changes to your routine"
                },
                { 
                  step: "03", 
                  title: "Earn TDAO Tokens Automatically", 
                  desc: "Get paid when your data creates value", 
                  icon: Coins, 
                  detail: "Every time your anonymized data helps researchers or brands, you earn tokens automatically",
                  tooltip: "No extra clicks. No extra effort. Just passive income"
                },
                { 
                  step: "04", 
                  title: "Cash Out or Reinvest", 
                  desc: "Your tokens have real value", 
                  icon: Target, 
                  detail: "Trade them, hold for governance votes, or reinvest to earn more. You're now a stakeholder",
                  tooltip: "Real value from your YouTube habits"
                }
              ].map((item, index) => (
                <div key={index} className="text-center group relative">
                  <div className="relative mb-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-red-500/25 group-hover:scale-110 transition-all duration-300 group-hover:shadow-red-500/40">
                      <item.icon className="w-10 h-10 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-black border border-red-500/30 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-red-400">{item.step}</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-red-400 transition-colors duration-300">{item.title}</h3>
                  <p className="text-gray-300 text-sm mb-3">{item.desc}</p>
                  <p className="text-gray-500 text-xs leading-relaxed">{item.detail}</p>
                  
                  {/* Tooltip */}
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full bg-black/90 backdrop-blur-sm text-white text-xs px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap z-10">
                    {item.tooltip}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Real Use Case Example */}
          <div className="mt-16 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-3xl p-8 border border-purple-500/20">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-white mb-4">Real Use Case Example</h3>
              <p className="text-gray-300 text-lg leading-relaxed max-w-4xl mx-auto">
                <strong>AI Video Research Lab</strong> licenses aggregated viewing patterns to study attention span trends. 
                Your anonymized data contributes to insights on optimal video length and content structure, 
                earning you tokens while advancing the creator economy.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Built on Real Data - COMPLETELY REVAMPED */}
      <section className="py-32 bg-gradient-to-b from-purple-900/10 to-transparent">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-black mb-8 text-white">
              Unlocking Unprecedented User Behavior & Ad Intelligence
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Our dual-source approach captures both foundational patterns and the deep, granular insights that drive real competitive advantage
            </p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Foundational Insights */}
            <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/5 backdrop-blur-xl border border-blue-500/20 p-8 hover:border-blue-400/50 transition-all duration-500 hover:scale-105">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-500/25">
                  <FileText className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Foundational Insights</h3>
                <p className="text-blue-400 font-semibold mb-4">(from Google Takeout)</p>
              </div>
              
              <div className="space-y-4 text-gray-300">
                <p className="text-lg leading-relaxed">Leverage your existing YouTube history:</p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center"><span className="text-blue-400 mr-2">•</span> Watch patterns & viewing history</li>
                  <li className="flex items-center"><span className="text-blue-400 mr-2">•</span> Search queries & interests</li>
                  <li className="flex items-center"><span className="text-blue-400 mr-2">•</span> Subscribed channels & creators</li>
                  <li className="flex items-center"><span className="text-blue-400 mr-2">•</span> Playlist preferences & organization</li>
                </ul>
                <p className="text-xs text-gray-400 italic mt-4">
                  Examples: &quot;Top Genres Watched,&quot; &quot;Favorite Creators,&quot; &quot;Content Discovery Patterns&quot;
                </p>
              </div>
            </Card>
            
            {/* Deep Dive Insights */}
            <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/5 backdrop-blur-xl border border-purple-500/20 p-8 hover:border-purple-400/50 transition-all duration-500 hover:scale-105">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-purple-500/25">
                  <Brain className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Deep Dive Insights</h3>
                <p className="text-purple-400 font-semibold mb-4">(from Chrome Extension)</p>
              </div>
              
              <div className="space-y-4 text-gray-300">
                <p className="text-lg leading-relaxed">Our Chrome Extension captures the missing pieces:</p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center"><span className="text-purple-400 mr-2">🎯</span> Premium feature usage patterns</li>
                  <li className="flex items-center"><span className="text-pink-400 mr-2">📺</span> Ad interaction & skip behavior</li>
                  <li className="flex items-center"><span className="text-cyan-400 mr-2">⚡</span> Real-time engagement metrics</li>
                  <li className="flex items-center"><span className="text-yellow-400 mr-2">💡</span> Content stickiness insights</li>
                </ul>
                <p className="text-xs text-gray-400 italic mt-4">
                  Deep behavioral data that drives competitive advantage for creators and advertisers.
                </p>
              </div>
            </Card>
            
            {/* Privacy & Aggregation */}
            <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/5 backdrop-blur-xl border border-green-500/20 p-8 hover:border-green-400/50 transition-all duration-500 hover:scale-105">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/25">
                  <Shield className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Privacy & Aggregation</h3>
                <p className="text-green-400 font-semibold mb-4">(Powered by Vana)</p>
              </div>
              
              <div className="space-y-4 text-gray-300">
                <p className="text-lg leading-relaxed">All data is anonymized and aggregated within <strong>Vana&apos;s Secure Runtime (TEEs)</strong>.</p>
                
                <div className="space-y-3 text-sm">
                  <div className="flex items-start">
                    <span className="text-green-400 mr-2 mt-1">🔒</span>
                    <div>
                      <strong>Your raw, personal data remains private</strong>
                      <p className="text-gray-400">Never exposed to TubeDAO or data buyers</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <span className="text-green-400 mr-2 mt-1">📊</span>
                    <div>
                      <strong>Collective insights made available</strong>
                      <p className="text-gray-400">For ethical research and AI training</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <span className="text-green-400 mr-2 mt-1">💰</span>
                    <div>
                      <strong>You earn from data value</strong>
                      <p className="text-gray-400">TubeDAO tokens represent your ownership stake</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
          
          {/* Value Proposition Footer */}
          <div className="mt-16 bg-gradient-to-r from-red-500/10 to-purple-500/10 rounded-3xl p-8 border border-red-500/20 text-center">
            <h3 className="text-3xl font-bold text-white mb-4">The Missing Piece of the Digital Economy</h3>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              By combining <span className="text-blue-400 font-semibold">foundational data</span> with <span className="text-purple-400 font-semibold">granular behavioral insights</span>, 
              TubeDAO creates the most comprehensive and valuable dataset in the creator economy — 
              finally giving users ownership and fair compensation for their digital contributions.
            </p>
          </div>
        </div>
      </section>

      {/* Be the First - Enhanced */}
      <section className="py-16 sm:py-24 lg:py-32 bg-gradient-to-b from-transparent to-red-900/20">
        <div className="container mx-auto px-4 sm:px-6 max-w-4xl text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-6 sm:mb-8 text-white">
            Join the Next Generation
          </h2>
          <p className="text-lg sm:text-xl lg:text-2xl text-gray-300 mb-3 sm:mb-4 leading-relaxed">
            Own your digital footprint. For real.
          </p>
          <p className="text-base sm:text-lg lg:text-xl text-gray-400 mb-12 sm:mb-16">
            TubeDAO is launching soon. Get early access to revolutionary data ownership.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16">
            <div className="text-center group sm:col-span-2 lg:col-span-1">
              <div className="w-16 h-16 sm:w-18 sm:h-18 lg:w-20 lg:h-20 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-purple-500/25">
                <Users className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white mb-3">Private DAO Voting Rights</h3>
              <p className="text-gray-300 text-sm sm:text-base">Shape data licensing decisions with exclusive voting power via Snapshot</p>
            </div>
            
            <div className="text-center group">
              <div className="w-16 h-16 sm:w-18 sm:h-18 lg:w-20 lg:h-20 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-yellow-500/25">
                <Coins className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white mb-3">Exclusive Token Airdrop</h3>
              <p className="text-gray-300 text-sm sm:text-base">First 300 contributors get exclusive TDAO token airdrop</p>
            </div>
            
            <div className="text-center group">
              <div className="w-16 h-16 sm:w-18 sm:h-18 lg:w-20 lg:h-20 bg-gradient-to-br from-red-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-red-500/25">
                <Target className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white mb-3">Cross-DAO Identity</h3>
              <p className="text-gray-300 text-sm sm:text-base">Reusable digital identity for other Vana DAOs and Web3 platforms</p>
            </div>
          </div>
          
          {/* Urgency/Scarcity Section */}
          <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-3xl p-6 sm:p-8 lg:p-12 border border-yellow-500/30 mb-8 sm:mb-12 relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute top-0 left-0 w-full h-full">
              <div className="absolute top-4 right-4 w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
              <div className="absolute bottom-6 left-6 w-2 h-2 bg-orange-400 rounded-full animate-bounce"></div>
              <div className="absolute top-1/2 left-4 w-1 h-1 bg-yellow-300 rounded-full animate-ping"></div>
            </div>
            
            <div className="relative z-10 text-center">
              <div className="flex items-center justify-center gap-2 mb-4 sm:mb-6">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-white">Limited Time: Early Contributors Get Exclusive Token Airdrop</h3>
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              </div>
              
              <div className="max-w-4xl mx-auto mb-6 sm:mb-8">
                <p className="text-base sm:text-lg lg:text-xl text-gray-200 leading-relaxed mb-4">
                  <span className="text-yellow-400 font-bold">Here&apos;s the deal:</span> The first <span className="text-yellow-400 font-bold">300 people</span> to join TubeDAO get an <span className="text-yellow-400 font-bold">exclusive token airdrop</span> at launch. <span className="text-white font-bold">Limited time only.</span>
                </p>
                <p className="text-base sm:text-lg lg:text-xl text-gray-200 leading-relaxed mb-4">
                  This means you get <span className="text-yellow-400 font-bold">free TDAO tokens</span> just for being early. Plus you earn more tokens from your ongoing YouTube data.
                </p>
                <p className="text-base sm:text-lg lg:text-xl text-gray-200 leading-relaxed mb-6">
                  But here&apos;s the catch - once we hit 300 early contributors, this airdrop <span className="text-red-400 font-bold">disappears</span>. No extensions. No exceptions.
                </p>
                
                {/* Spots remaining */}
                <div className="bg-black/30 rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8 border border-yellow-500/30">
                  <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-yellow-400 mb-2">47</div>
                  <p className="text-base sm:text-lg text-gray-300">spots remain as of today</p>
                </div>
                
                <p className="text-base sm:text-lg lg:text-xl text-white font-medium mb-8">
                  Don&apos;t let someone else take the spot that could get you <span className="text-yellow-400 font-bold">free airdrop tokens</span>.
                </p>
              </div>
              
              <WaitlistForm 
                variant="modal" 
                triggerText="Claim My Airdrop Spot"
                triggerClassName="text-base sm:text-lg lg:text-xl px-8 sm:px-10 lg:px-12 py-4 sm:py-5 lg:py-6 w-full sm:w-auto bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black font-black shadow-2xl hover:shadow-yellow-500/50 transform hover:scale-105"
              />
            </div>
          </div>
          
          {/* Final CTA Section - Simplified */}
          <div className="bg-gradient-to-r from-red-500/20 to-purple-500/20 rounded-3xl p-6 sm:p-8 lg:p-12 border border-red-500/30 relative overflow-hidden">
            <div className="relative z-10 text-center max-w-3xl mx-auto">
              {/* Visual comparison */}
              <div className="grid grid-cols-2 gap-8 mb-8">
                <div className="text-center">
                  <div className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-400 mb-2">$0</div>
                  <p className="text-gray-400 text-sm sm:text-base">What you earn now</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl sm:text-5xl lg:text-6xl font-black text-green-400 mb-2">$600+</div>
                  <p className="text-green-400 text-sm sm:text-base">What you could earn yearly</p>
                </div>
              </div>
              
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-4 leading-tight">
                Stop giving it away. <span className="text-red-400">Start getting paid.</span>
              </h3>
              
              <p className="text-lg sm:text-xl text-gray-200 mb-8">
                Your choice: <span className="text-red-400 font-bold">Keep earning $0</span> or <span className="text-green-400 font-bold">start earning today</span>.
              </p>
              
              <WaitlistForm 
                variant="modal" 
                triggerText="Start Earning Today"
                triggerClassName="text-base sm:text-lg lg:text-xl px-8 sm:px-10 lg:px-12 py-4 sm:py-5 lg:py-6 w-full sm:w-auto bg-gradient-to-r from-red-500 to-purple-600 hover:from-red-600 hover:to-purple-700 text-white font-black shadow-2xl hover:shadow-red-500/50 transform hover:scale-105 border-2 border-red-400/30 hover:border-red-400/50"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 sm:py-12 border-t border-white/10 bg-gradient-to-t from-black to-transparent">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
            <div className="text-center lg:text-left">
              <h3 className="text-2xl sm:text-3xl font-black text-white mb-2">TubeDAO</h3>
              <p className="text-gray-400 text-sm sm:text-base">The world&apos;s first YouTube Premium Data DAO</p>
              <p className="text-gray-500 text-xs sm:text-sm">Built on Vana • Secured by Zero-Knowledge</p>
              <div className="flex items-center justify-center lg:justify-start gap-2 mt-2">
                <span className="text-gray-500 text-xs sm:text-sm">Contact:</span>
                <a href="mailto:deeptanshu@eonxi.com" className="text-blue-400 hover:underline text-xs sm:text-sm">deeptanshu@eonxi.com</a>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 lg:gap-8 items-center">
              <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
                <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Privacy Policy</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Terms</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Docs</a>
              </div>
              
              <div className="flex space-x-3 sm:space-x-4">
                <a href="https://github.com/tubedao" className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-lg">
                  <Github className="w-4 h-4 sm:w-5 sm:h-5" />
                </a>
                <a href="https://x.com/tubedao" className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-lg">
                  <Twitter className="w-4 h-4 sm:w-5 sm:h-5" />
                </a>
                <a href="https://discord.gg/tubedao" className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-lg">
                  <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                </a>
              </div>
            </div>
          </div>
          
          <Separator className="my-6 sm:my-8 bg-white/10" />
          
          <div className="text-center text-gray-500">
            <p className="text-xs sm:text-sm">&copy; 2025 TubeDAO. All rights reserved.</p>
            <p className="mt-2 text-xs sm:text-sm">Powered by Vana • Featured in Web3 Data Innovation</p>
          </div>
        </div>
      </footer>

      {/* Enhanced Floating Waitlist Button */}
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
      <Dialog open={showExitIntent} onOpenChange={setShowExitIntent}>
        <DialogContent className="sm:max-w-md bg-black/95 backdrop-blur-xl border border-red-500/50 p-6">
          <div className="text-center">
            <div className="mb-4">
              <h3 className="text-2xl font-bold text-white mb-2">Wait! Don't Miss Out</h3>
              <p className="text-red-400 font-bold text-lg">Exclusive 10x Multiplier for Next 10 Minutes</p>
            </div>
            
            <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 mb-6">
              <p className="text-white font-bold mb-2">LIMITED TIME OFFER:</p>
              <p className="text-gray-300 text-sm">
                First 50 people who join in the next 10 minutes get a <span className="text-red-400 font-bold">10x multiplier</span> instead of 5x. 
                That means earning up to <span className="text-green-400 font-bold">$500/month</span> instead of $50.
              </p>
            </div>
            
            <div className="mb-6">
              <div className="text-3xl font-black text-red-400 mb-2">47</div>
              <p className="text-gray-300 text-sm">spots remaining</p>
            </div>
            
            <WaitlistForm 
              variant="modal" 
              triggerText="Claim My 10x Multiplier Now"
              triggerClassName="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-black py-4 px-6 rounded-lg shadow-2xl hover:shadow-red-500/50 transition-all duration-300 transform hover:scale-105 text-sm mb-4"
            />
            
            <button 
              onClick={() => setShowExitIntent(false)}
              className="text-gray-400 hover:text-white text-sm underline"
            >
              No thanks, I'll pass on earning $500/month
            </button>
          </div>
        </DialogContent>
      </Dialog>

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
        
        .header-breathe {
          animation: breathe-header 3s ease-in-out infinite;
        }
        
        @keyframes breathe-header {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
      `}</style>


    </div>
  );
}

 