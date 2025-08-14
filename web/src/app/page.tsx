"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import dynamic from 'next/dynamic';

import { useAuth } from '@/hooks/useAuth';
import { InlineAuth } from '@/components/InlineAuth';

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

const Dashboard = dynamic(
  () => import("@/components/Dashboard").then((mod) => ({ default: mod.Dashboard })),
  { 
    ssr: false,
    loading: () => (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    )
  }
);

import { 
  Users, 
  Shield, 
  Upload, 
  Coins, 
  FileText, 
  CheckCircle,
  Target,
  Gift,
  Bell,
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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return <ClientTubeDAO />;
}

function ClientTubeDAO() {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const { isAuthenticated, token } = useAuth();
  
  // If user is authenticated, show the dashboard
  if (isAuthenticated) {
    return <Dashboard authToken={token} />;
  }

  const handleWaitlistSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setTimeout(() => {
        setIsSubscribed(false);
        setEmail("");
      }, 3000);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsUploading(true);
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        setUploadProgress(progress);
        if (progress >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          setTimeout(() => setUploadProgress(0), 2000);
        }
      }, 200);
    }
  };





  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      <header className="fixed top-0 right-0 z-50 p-6">
        <div className="flex items-center gap-4">
          <WalletConnection />
        </div>
      </header>

      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute top-0 left-1/4 w-96 h-96 bg-red-500/20 rounded-full blur-3xl animate-pulse" 
          style={{ transform: `translateY(${scrollY * 0.5}px)` }}
        />
        <div 
          className="absolute top-1/3 right-1/4 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000" 
          style={{ transform: `translateY(${scrollY * 0.3}px)` }}
        />
        <div 
          className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-2000" 
          style={{ transform: `translateY(${scrollY * 0.2}px)` }}
        />
      </div>

      <section className="relative min-h-screen flex items-center justify-center px-6">
        <div className="container mx-auto text-center max-w-6xl relative z-10">
          <div className="flex justify-center items-center mb-8">
            <Badge className="bg-gradient-to-r from-red-500/20 to-purple-500/20 text-red-300 border-red-500/30 px-6 py-3 text-sm font-medium">
              <Sparkles className="w-4 h-4 mr-2" />
              Built on Vana • Trusted by 1.3M+ Users • Featured in Web3 Innovation
            </Badge>
          </div>
          
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-black mb-8 tracking-tight">
            <span className="bg-gradient-to-r from-white via-red-200 to-pink-200 bg-clip-text text-transparent">
              TUBE
            </span>
            <span className="bg-gradient-to-r from-red-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
              DAO
            </span>
          </h1>
          
          <div className="max-w-4xl mx-auto mb-12">
            <p className="text-3xl md:text-4xl text-gray-300 mb-6 font-light leading-relaxed">
              <span className="text-red-400 font-bold">Unlock the Deepest YouTube Insights.</span><br />
              Own Your Data.
            </p>
            <p className="text-xl md:text-2xl text-gray-400 font-light leading-relaxed">
              Your viewing data was the product.<br />
              <span className="text-white font-medium">Now it&apos;s your power.</span>
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16 max-w-4xl mx-auto">
            <form onSubmit={handleWaitlistSignup} className="flex gap-3 bg-white/5 backdrop-blur-lg rounded-2xl p-3 border border-white/10 hover:border-red-500/30 transition-all duration-300 w-full sm:w-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-transparent border-0 text-white placeholder:text-gray-400 text-lg px-6 py-4 w-full sm:w-80 focus:ring-0"
                required
              />
              <Button 
                type="submit" 
                size="lg" 
                className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-red-500/25 transition-all duration-300 whitespace-nowrap"
                disabled={isSubscribed}
              >
                {isSubscribed ? (
                  <>
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Joined!
                  </>
                ) : (
                  <>
                    <Bell className="w-5 h-5 mr-2" />
                    Join Waitlist
                  </>
                )}
              </Button>
            </form>
            
            <InlineAuth />
          </div>
          
          <p className="text-gray-500 text-sm">
            <Lock className="w-4 h-4 inline mr-2" />
            Privacy Protected • No Spam • Zero-Knowledge Powered
          </p>
          
          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <ChevronDown className="w-6 h-6 text-gray-400" />
          </div>
        </div>
      </section>

      <section className="py-32 relative bg-gradient-to-b from-transparent via-gray-900/10 to-transparent">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-6 text-white">
              Watch How It Works
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              See our Chrome extension capture real-time YouTube data and how users maintain complete control over their digital footprint.
            </p>
          </div>
          
          <div className="relative group">
            <div className="relative bg-gradient-to-br from-gray-900/40 to-gray-800/20 backdrop-blur-xl rounded-3xl border border-gray-700/50 overflow-hidden shadow-2xl hover:shadow-purple-500/20 transition-all duration-700 hover:border-purple-500/30 hover:scale-[1.02] animate-pulse hover:animate-none group-hover:shadow-purple-500/30">
              <div className="absolute -top-4 -left-4 w-8 h-8 bg-purple-500/30 rounded-full blur-sm animate-bounce"></div>
              <div className="absolute -top-6 -right-6 w-6 h-6 bg-pink-500/40 rounded-full blur-sm animate-bounce delay-1000"></div>
              <div className="absolute -bottom-4 -left-6 w-10 h-10 bg-red-500/20 rounded-full blur-sm animate-bounce delay-500"></div>
              
              <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-purple-500/20 to-transparent rounded-br-full animate-pulse"></div>
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-pink-500/20 to-transparent rounded-tl-full animate-pulse delay-1000"></div>
              
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
                
                <div className="absolute inset-4 md:inset-8 rounded-2xl pointer-events-none">
                  <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 opacity-80 animate-pulse"></div>
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-red-500 via-pink-500 to-purple-500 opacity-80 animate-pulse delay-500"></div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-24 grid md:grid-cols-3 gap-6">
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-purple-500/25">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Privacy First</h3>
              <p className="text-gray-400 text-sm">Data stays local until you choose to contribute</p>
            </div>
            
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-pink-500/25">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Real-Time Capture</h3>
              <p className="text-gray-400 text-sm">Live behavioral data as you browse YouTube</p>
            </div>
            
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-red-500/25">
                <Coins className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Earn Rewards</h3>
              <p className="text-gray-400 text-sm">Get tokens when your data creates value</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-32 relative bg-gradient-to-b from-transparent to-gray-900/20">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-black mb-8 text-white">
              Upload. Vote. Earn.<br />Take Back Control.
            </h2>
                          <p className="text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                TubeDAO helps you upload & contribute your anonymized YouTube Premium data,<br />
                <span className="text-white font-medium">you vote on how it&apos;s licensed, and earn rewards.</span>
              </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
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

      {/* Why Now */}
      <section className="py-32 bg-gradient-to-b from-red-900/10 to-transparent relative">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-black mb-8 text-white">
              Why Now?
            </h2>
            <p className="text-2xl text-gray-300 mb-4">
              You&apos;ve always been the product.
            </p>
            <p className="text-2xl text-white font-medium">
              Now, you become the stakeholder.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="text-6xl font-black text-red-400 mb-4 group-hover:scale-105 transition-transform duration-300">$240B+</div>
              <h3 className="text-2xl font-bold text-white mb-4">YouTube Revenue</h3>
              <p className="text-gray-300 mb-3">
                YouTube generates hundreds of billions annually from Premium subscriptions — it&apos;s time users got their share
              </p>
              <a href="https://abc.xyz/investor/" target="_blank" className="text-xs text-blue-400 hover:underline flex items-center justify-center gap-1">
                Source: Alphabet Inc. <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            
            <div className="text-center group">
              <div className="text-6xl font-black text-purple-400 mb-4 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                <Brain className="w-16 h-16" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Deep User Data Remains a Black Box</h3>
              <p className="text-gray-300">
                Critical insights into how users truly interact with premium features and ads are locked away. TubeDAO breaks these silos, providing a granular view previously unavailable.
              </p>
            </div>
            
            <div className="text-center group">
              <div className="text-6xl font-black text-pink-400 mb-4 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                <Layers className="w-16 h-16" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Zero-Knowledge Era</h3>
              <p className="text-gray-300">
                Blockchain and ZK technology finally enable true data ownership, on-chain governance, and digital identity control
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-32 bg-gradient-to-b from-transparent to-purple-900/10 relative">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-black mb-8 text-white">
              How It Works
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Simple, secure, and rewarding — from data export to token earnings
            </p>
          </div>
          
          {/* Visual Timeline */}
          <div className="relative">
            <div className="grid md:grid-cols-4 gap-8">
              {[
                { 
                  step: "01", 
                  title: "Connect Wallet", 
                  desc: "Connect your crypto wallet to start contributing", 
                  icon: Wallet, 
                  detail: "Secure wallet connection for token rewards and governance",
                  tooltip: "MetaMask, WalletConnect, and other popular wallets supported"
                },
                { 
                  step: "02", 
                  title: "Contribute Your Data", 
                  desc: "Two powerful ways to share your YouTube insights", 
                  icon: Upload, 
                  detail: "Option A: Google Takeout Import for foundational history. Option B: Install our Chrome Extension for deep, real-time insights on Premium features and ad interactions",
                  tooltip: "Chrome extension captures granular data on Premium usage and ad metrics"
                },
                { 
                  step: "03", 
                  title: "Vana Validates & Tokenizes", 
                  desc: "Vana DataDAO validates and issues TubeDAO tokens", 
                  icon: Shield, 
                  detail: "Your anonymized contributions are validated and you receive TubeDAO VRC-20 tokens representing ownership in this high-value dataset",
                  tooltip: "Powered by Vana's secure validation infrastructure"
                },
                { 
                  step: "04", 
                  title: "Earn & Govern", 
                  desc: "Receive tokens and participate in DAO governance", 
                  icon: Coins, 
                  detail: "Your TubeDAO tokens represent your share of future data sales and governance rights in the ecosystem",
                  tooltip: "Higher rewards for richer data contributions and active governance"
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
      <section className="py-32 bg-gradient-to-b from-transparent to-red-900/20">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <h2 className="text-5xl md:text-6xl font-black mb-8 text-white">
            Join the Next Generation
          </h2>
          <p className="text-2xl text-gray-300 mb-4 leading-relaxed">
            Own your digital footprint. For real.
          </p>
          <p className="text-xl text-gray-400 mb-16">
            TubeDAO is launching soon. Get early access to revolutionary data ownership.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-purple-500/25">
                <Users className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Private DAO Voting Rights</h3>
              <p className="text-gray-300">Shape data licensing decisions with exclusive voting power via Snapshot</p>
            </div>
            
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-yellow-500/25">
                <Coins className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">First-Wave Token Bonuses</h3>
              <p className="text-gray-300">Early contributors receive 2x token multipliers and exclusive airdrops</p>
            </div>
            
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-red-500/25">
                <Target className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Cross-DAO Identity</h3>
              <p className="text-gray-300">Reusable digital identity for other Vana DAOs and Web3 platforms</p>
            </div>
          </div>
          
          <div className="mb-12">
            <form onSubmit={handleWaitlistSignup} className="max-w-md mx-auto">
              <div className="flex gap-3 bg-black/30 backdrop-blur-lg rounded-2xl p-3 border border-white/20">
                <Input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-transparent border-0 text-white placeholder:text-gray-400 text-lg px-4 focus:ring-0"
                  required
                />
                <Button 
                  type="submit" 
                  className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white px-8 py-3 font-semibold rounded-xl shadow-lg hover:shadow-red-500/25 transition-all duration-300"
                  disabled={isSubscribed}
                >
                  {isSubscribed ? "Joined!" : "Join Waitlist"}
                </Button>
              </div>
            </form>
          </div>
          
          <div className="text-center bg-gradient-to-r from-red-500/10 to-pink-500/10 rounded-3xl p-8 border border-red-500/20">
            <p className="text-2xl md:text-3xl text-gray-300 mb-4 font-light">
              Your viewing data has always worked for someone else.
            </p>
            <p className="text-2xl md:text-3xl text-white font-bold">
              It&apos;s time it worked for you.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/10 bg-gradient-to-t from-black to-transparent">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <h3 className="text-3xl font-black text-white mb-2">TubeDAO</h3>
              <p className="text-gray-400">The world&apos;s first YouTube Premium Data DAO</p>
              <p className="text-gray-500 text-sm">Built on Vana • Secured by Zero-Knowledge</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-gray-500 text-sm">Contact:</span>
                <a href="mailto:hello@tubedao.org" className="text-blue-400 hover:underline text-sm">hello@tubedao.org</a>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-center">
              <div className="flex space-x-6">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Terms</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Docs</a>
              </div>
              
              <div className="flex space-x-4">
                <a href="https://github.com/tubedao" className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-lg">
                  <Github className="w-5 h-5" />
                </a>
                <a href="https://x.com/tubedao" className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-lg">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="https://discord.gg/tubedao" className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-lg">
                  <MessageCircle className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
          
          <Separator className="my-8 bg-white/10" />
          
          <div className="text-center text-gray-500">
            <p>&copy; 2025 TubeDAO. All rights reserved.</p>
            <p className="mt-2">Powered by Vana • Featured in Web3 Data Innovation</p>
          </div>
        </div>
      </footer>

      {/* Enhanced Upload Modal */}
      <Dialog>
        <DialogTrigger asChild>
          <Button className="fixed bottom-8 right-8 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white p-4 rounded-full shadow-2xl z-50 hover:scale-110 transition-all duration-300">
            <Upload className="w-6 h-6" />
          </Button>
        </DialogTrigger>
        <DataUploadModal 
          onFileUpload={handleFileUpload} 
          uploadProgress={uploadProgress} 
          isUploading={isUploading} 
        />
      </Dialog>
    </div>
  );
}



function DataUploadModal({ onFileUpload, uploadProgress, isUploading }: {
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  uploadProgress: number;
  isUploading: boolean;
}) {
  return (
    <DialogContent className="sm:max-w-[700px] bg-black border border-white/20 backdrop-blur-xl">
      <DialogHeader>
        <DialogTitle className="text-white flex items-center text-2xl">
          <Upload className="w-6 h-6 mr-3 text-red-400" />
          Contribute Your YouTube Premium Data
        </DialogTitle>
        <DialogDescription className="text-gray-300 text-lg">
          Help build the future of content economics. Your data stays anonymous, you keep control, and earn rewards.
        </DialogDescription>
      </DialogHeader>
      
      <div className="space-y-6">
        {/* Data Preview Section */}
        <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/5 rounded-2xl p-6 border border-blue-500/20">
          <h3 className="text-white font-bold mb-4 flex items-center text-lg">
            <Eye className="w-5 h-5 mr-3 text-blue-400" />
            What Your Anonymized Data Looks Like
          </h3>
          <div className="bg-black/40 rounded-lg p-4 font-mono text-sm">
            <div className="text-green-400">{"{"}</div>
            <div className="text-gray-300 ml-4">&quot;user_id&quot;: &quot;anonymous_hash_abc123&quot;,</div>
            <div className="text-gray-300 ml-4">&quot;viewing_patterns&quot;: {"{"}</div>
            <div className="text-gray-300 ml-8">&quot;avg_session_length&quot;: &quot;23m&quot;,</div>
            <div className="text-gray-300 ml-8">&quot;preferred_categories&quot;: [&quot;tech&quot;, &quot;education&quot;],</div>
            <div className="text-gray-300 ml-8">&quot;premium_features_used&quot;: [&quot;offline&quot;, &quot;no_ads&quot;]</div>
            <div className="text-gray-300 ml-4">{"}"}</div>
            <div className="text-green-400">{"}"}</div>
          </div>
          <p className="text-gray-400 text-sm mt-3">All personal identifiers removed • Geographic data aggregated • Viewing times anonymized</p>
        </div>
        
        <div className="bg-gradient-to-br from-red-500/10 to-pink-500/5 rounded-2xl p-6 border border-red-500/20">
          <h3 className="text-white font-bold mb-4 flex items-center text-lg">
            <FileText className="w-5 h-5 mr-3 text-blue-400" />
            How to Export Your YouTube Premium Data
          </h3>
          <ol className="space-y-3 text-gray-300">
            <li className="flex items-start">
              <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-sm rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 font-bold">1</span>
              Visit <a href="https://takeout.google.com" className="text-blue-400 hover:underline font-medium" target="_blank">Google Takeout <ExternalLink className="w-4 h-4 inline ml-1" /></a>
            </li>
            <li className="flex items-start">
              <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-sm rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 font-bold">2</span>
              Select <strong>&quot;YouTube and YouTube Music&quot;</strong> from the services list
            </li>
            <li className="flex items-start">
              <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-sm rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 font-bold">3</span>
              Choose <strong>JSON format</strong> and click &quot;Create Export&quot;
            </li>
            <li className="flex items-start">
              <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-sm rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 font-bold">4</span>
              Download the file and upload it below when ready
            </li>
          </ol>
        </div>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="data-file" className="text-white text-lg font-medium">Upload YouTube Data (JSON/ZIP)</Label>
            <Input
              id="data-file"
              type="file"
              accept=".json,.zip"
              onChange={onFileUpload}
              className="bg-white/5 border-white/20 text-white file:bg-gradient-to-r file:from-red-500 file:to-pink-500 file:text-white file:border-0 file:rounded-xl file:px-4 file:py-2 file:mr-4 mt-2"
            />
          </div>
          
          {isUploading && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-300">Uploading & Anonymizing...</span>
                <span className="text-gray-300">{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="h-3" />
            </div>
          )}
          
          <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
            <div className="flex items-start space-x-3">
              <Shield className="w-5 h-5 text-green-400 mt-0.5" />
              <div>
                <h4 className="text-green-400 font-bold">Privacy Guaranteed</h4>
                <p className="text-sm text-gray-300">
                  Your data is automatically anonymized using zero-knowledge cryptography. No personal identifiers are stored or shared.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-between pt-4">
          <Button variant="outline" className="border-white/20 text-gray-300 hover:bg-white/5">
            Learn More
          </Button>
          <Button className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600">
            <Gift className="w-4 h-4 mr-2" />
            Upload & Earn Rewards
          </Button>
        </div>
      </div>
    </DialogContent>
  );
} 