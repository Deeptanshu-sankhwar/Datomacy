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
import { 
  Play, 
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

  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Enhanced Animated Background */}
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

      {/* Hero Section */}
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
              First-ever <span className="text-red-400 font-bold">YouTube Premium</span> Data DAO
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
            
            <Button 
              size="lg" 
              onClick={() => scrollToSection('how-it-works')}
              className="bg-white/15 border border-white/50 text-white hover:bg-white/25 hover:border-white/70 px-8 py-4 text-lg font-semibold w-full sm:w-auto backdrop-blur-md shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              <Play className="w-5 h-5 mr-2" />
              How It Works
            </Button>
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

      {/* What's TubeDAO */}
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
            <Card className="bg-gradient-to-br from-red-500/10 to-pink-500/5 backdrop-blur-xl border border-red-500/20 text-center p-8 hover:border-red-400/50 transition-all duration-500 group hover:scale-105">
              <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-red-500/25">
                <Upload className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Upload & Contribute</h3>
              <p className="text-gray-300 text-lg">Upload your YouTube Premium data and contribute to revolutionary insights</p>
            </Card>
            
            <Card className="bg-gradient-to-br from-purple-500/10 to-indigo-500/5 backdrop-blur-xl border border-purple-500/20 text-center p-8 hover:border-purple-400/50 transition-all duration-500 group hover:scale-105">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-purple-500/25">
                <Users className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">You Vote</h3>
              <p className="text-gray-300 text-lg">You vote on how your data is licensed through transparent DAO governance</p>
            </Card>
            
            <Card className="bg-gradient-to-br from-yellow-500/10 to-orange-500/5 backdrop-blur-xl border border-yellow-500/20 text-center p-8 hover:border-yellow-400/50 transition-all duration-500 group hover:scale-105">
              <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-yellow-400/30">
                <Coins className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Receive Tokens</h3>
              <p className="text-gray-300 text-lg">Receive tokens when your data is licensed to researchers and brands</p>
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
                  <h3 className="text-2xl font-bold text-white mb-3">Zero-Knowledge Powered</h3>
                  <p className="text-gray-300 text-lg leading-relaxed">
                    Not even TubeDAO sees your raw files. Advanced cryptographic anonymization protects your identity while preserving data utility.
                  </p>
                  <p className="text-green-400 font-medium mt-2">✨ Differential privacy built on-chain</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-6 group">
                <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-sm shadow-purple-400/20">
                  <Eye className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-3">You&apos;re in Control</h3>
                  <p className="text-gray-300 text-lg leading-relaxed">
                    Every data decision goes through DAO governance — no more data black boxes or corporate control
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
                  <h3 className="text-2xl font-bold text-white mb-3">Get Rewarded When Licensed</h3>
                  <p className="text-gray-300 text-lg leading-relaxed">
                    Get rewarded when your YouTube Premium insights are licensed by AI companies, researchers, or media labs
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-6 group">
                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-sm shadow-blue-400/20">
                  <CheckCircle className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-3">Bank-Grade Encryption Meets DAO Transparency</h3>
                  <p className="text-gray-300 text-lg leading-relaxed">
                    GDPR compliance, SOC 2 standards, and institutional-grade privacy protection with full transparency
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
              <h3 className="text-2xl font-bold text-white mb-4">LLMs Trained on You</h3>
              <p className="text-gray-300">
                LLMs are trained on your digital behavior and viewing patterns. It&apos;s time to own that data and profit from it.
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
                  title: "Upload Your Data", 
                  desc: "Download & upload your YouTube data via Google Takeout", 
                  icon: Upload, 
                  detail: "Get comprehensive JSON files with watch history, subscriptions, and preferences",
                  tooltip: "We'll guide you through the simple Google Takeout process"
                },
                { 
                  step: "02", 
                  title: "Secure Processing", 
                  desc: "Advanced cryptographic anonymization protects your identity", 
                  icon: Shield, 
                  detail: "Zero-knowledge proofs ensure even TubeDAO can't see your raw data",
                  tooltip: "Military-grade privacy protection"
                },
                { 
                  step: "03", 
                  title: "DAO Governance", 
                  desc: "Vote on data usage proposals through Snapshot governance", 
                  icon: Users, 
                  detail: "Community-driven decisions on research partnerships and licensing deals",
                  tooltip: "Every licensing decision goes through transparent DAO vote"
                },
                { 
                  step: "04", 
                  title: "Earn Rewards", 
                  desc: "Receive tokens when data is licensed to approved partners", 
                  icon: Coins, 
                  detail: "Automatic distribution based on data contribution value and rarity",
                  tooltip: "Higher rewards for unique viewing patterns and longer history"
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

      {/* Built on Real Rails - Redesigned */}
      <section className="py-32 bg-gradient-to-b from-purple-900/10 to-transparent">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-black mb-8 text-white">
              Built on Real Rails
            </h2>
            <p className="text-xl text-gray-300">
              Powered by proven infrastructure trusted by millions
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12">
            {/* Vana Card */}
            <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/5 backdrop-blur-xl border border-purple-500/20 p-8 hover:border-purple-400/50 transition-all duration-500 hover:scale-105">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 text-xl font-bold">
                    VANA
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-purple-400" />
                  <ExternalLink className="w-4 h-4 text-gray-400" />
                </div>
              </div>
              
              <h3 className="text-3xl font-bold text-white mb-4">World&apos;s Leading Data Network</h3>
              <p className="text-gray-300 text-lg mb-8 leading-relaxed">
                Vana powers TubeDAO&apos;s secure data infrastructure with 1.3M+ users and 300+ DAOs.
              </p>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-black text-purple-400 mb-2">1.3M+</div>
                  <div className="text-sm text-gray-400">Active Users</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-black text-pink-400 mb-2">300+</div>
                  <div className="text-sm text-gray-400">DataDAOs</div>
                </div>
              </div>
            </Card>
            
            {/* Privacy Card */}
            <Card className="bg-gradient-to-br from-green-500/10 to-blue-500/5 backdrop-blur-xl border border-green-500/20 p-8 hover:border-green-400/50 transition-all duration-500 hover:scale-105">
              <div className="flex items-center justify-between mb-6">
                <Badge className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-2 text-xl font-bold">
                  PRIVACY
                </Badge>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <Github className="w-4 h-4 text-gray-400" />
                </div>
              </div>
              
              <h3 className="text-3xl font-bold text-white mb-4">Enterprise-Grade Protection</h3>
              <p className="text-gray-300 text-lg mb-8 leading-relaxed">
                Military-grade privacy infrastructure with ZKPs, confidential smart contracts, and TEE technology.
              </p>
              
              <div className="space-y-4">
                {[
                  "🔐 TEE Technology",
                  "🔍 Zero-Knowledge Proofs", 
                  "📜 Confidential Smart Contracts",
                  "🛡️ Differential Privacy"
                ].map((item, index) => (
                  <div key={index} className="flex items-center text-gray-300 text-lg">
                    <span className="mr-3">{item.split(' ')[0]}</span>
                    <span>{item.substring(2)}</span>
                  </div>
                ))}
              </div>
            </Card>
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
          
          {/* Moved form outside the box for better visibility */}
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
            <p>&copy; 2024 TubeDAO. All rights reserved.</p>
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