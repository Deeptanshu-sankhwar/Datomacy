"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { WaitlistForm } from '@/components/WaitlistForm';
import Layout from '@/components/Layout';
import Link from 'next/link';
import { 
  Play, 
  Users, 
  Shield, 
  Coins,
  Target,
  Lock,
  ChevronDown,
  Github,
  Twitter,
  MessageCircle
} from "lucide-react";

export default function HomePage() {
  return (
    <Layout showExitIntent={true}>
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
              
              <Link href="/how-it-works">
                <Button 
                  size="lg" 
                  className="bg-white/15 border border-white/50 text-white hover:bg-white/25 hover:border-white/70 px-6 sm:px-8 py-4 text-base sm:text-lg font-semibold backdrop-blur-md shadow-xl hover:shadow-2xl transition-all duration-300 w-full sm:w-auto"
                >
                  <Play className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  See How You Earn
                </Button>
              </Link>
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
                <h3 className="text-xl sm:text-2xl font-bold text-white">You Control Your Data&apos;s Future</h3>
              </div>
              <p className="text-gray-300 text-base sm:text-lg leading-relaxed mb-4">
                <span className="text-white font-bold">You vote on how your data gets used.</span> As a TDAO token holder, you have real decision-making power.
              </p>
              <p className="text-purple-400 font-medium text-sm sm:text-base">You&apos;ll never be powerless while tech giants profit from your information again.</p>
              
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

      {/* Quick Navigation to Other Pages */}
      <section className="py-16 sm:py-24 lg:py-32 bg-gradient-to-b from-transparent to-gray-900/20 relative">
        <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-6 sm:mb-8 text-white">
              Ready to Learn More?
            </h2>
            <p className="text-lg sm:text-xl lg:text-2xl text-gray-300 max-w-3xl mx-auto">
              Explore how TubeDAO works and why it&apos;s the future of data ownership.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            <Link href="/how-it-works" className="group">
              <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/5 backdrop-blur-xl border border-blue-500/20 p-6 hover:border-blue-400/50 transition-all duration-500 hover:scale-105 shadow-2xl h-full">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Play className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">How It Works</h3>
                  <p className="text-gray-300 text-sm">Step-by-step guide to earning from YouTube</p>
                </div>
              </Card>
            </Link>
            
            <Link href="/why-tubedao" className="group">
              <Card className="bg-gradient-to-br from-yellow-500/10 to-orange-500/5 backdrop-blur-xl border border-yellow-500/20 p-6 hover:border-yellow-400/50 transition-all duration-500 hover:scale-105 shadow-2xl h-full">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Target className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-yellow-400 transition-colors">Why TubeDAO</h3>
                  <p className="text-gray-300 text-sm">The side hustle you&apos;re already doing</p>
                </div>
              </Card>
            </Link>
            
            <Link href="/technology" className="group">
              <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/5 backdrop-blur-xl border border-purple-500/20 p-6 hover:border-purple-400/50 transition-all duration-500 hover:scale-105 shadow-2xl h-full">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Shield className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-purple-400 transition-colors">Technology</h3>
                  <p className="text-gray-300 text-sm">Privacy-first data insights & AI</p>
                </div>
              </Card>
            </Link>
            
            <Link href="/join-waitlist" className="group">
              <Card className="bg-gradient-to-br from-red-500/10 to-pink-500/5 backdrop-blur-xl border border-red-500/20 p-6 hover:border-red-400/50 transition-all duration-500 hover:scale-105 shadow-2xl h-full">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Coins className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-red-400 transition-colors">Join Waitlist</h3>
                  <p className="text-gray-300 text-sm">Get exclusive airdrop & early access</p>
                </div>
              </Card>
            </Link>
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

      <style jsx>{`
        .header-breathe {
          animation: breathe-header 3s ease-in-out infinite;
        }
        
        @keyframes breathe-header {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
      `}</style>
    </Layout>
  );
}