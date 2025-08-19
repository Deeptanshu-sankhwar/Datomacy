"use client";

import { Card } from "@/components/ui/card";
import { WaitlistForm } from '@/components/WaitlistForm';
import Layout from '@/components/Layout';
import { 
  Play, 
  Shield, 
  Brain,
  Coins,
  Target,
  Wallet,
  FileText,
  Sparkles
} from "lucide-react";

export default function HowItWorksPage() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-16 sm:py-24 lg:py-32 relative">
        <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
          <div className="text-center mb-12 sm:mb-16 lg:mb-20">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-6 sm:mb-8 text-white">
              From Zero to Earning in Less Than <span className="text-red-400">5 Minutes</span>
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
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
          <div className="mt-16 bg-gradient-to-r from-red-500/10 to-pink-500/10 rounded-3xl p-8 border border-red-500/20">
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

      {/* What's TubeDAO - Simplified */}
      <section className="py-16 sm:py-24 lg:py-32 relative bg-gradient-to-b from-transparent to-gray-900/20">
        <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
          <div className="text-center mb-12 sm:mb-16 lg:mb-20">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-6 sm:mb-8 text-white">
              How TubeDAO <span className="text-red-400">Actually Works</span>
            </h2>
            <p className="text-lg sm:text-xl lg:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed px-4">
              Three simple components working together to put money in your pocket.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            <Card className="bg-gradient-to-br from-gray-900/90 to-gray-800/50 backdrop-blur-xl border border-gray-700/50 p-8 hover:border-gray-600/70 transition-all duration-500 group hover:scale-[1.02] shadow-2xl">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">Contribute Your Data</h3>
                  <p className="text-gray-400 text-sm">Dual-source data collection</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="bg-red-500/10 rounded-lg p-4 border border-red-500/20">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
                      <FileText className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-red-400 font-semibold">Google Takeout</span>
                  </div>
                  <p className="text-gray-300 text-sm">Historical watch patterns, subscriptions, and search data</p>
                </div>
                
                <div className="bg-pink-500/10 rounded-lg p-4 border border-pink-500/20">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-pink-500 rounded-lg flex items-center justify-center">
                      <Brain className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-pink-400 font-semibold">Chrome Extension</span>
                  </div>
                  <p className="text-gray-300 text-sm">Real-time Premium features and ad interaction metrics</p>
                </div>
              </div>
            </Card>
            
            <Card className="bg-gradient-to-br from-gray-900/90 to-gray-800/50 backdrop-blur-xl border border-gray-700/50 p-8 hover:border-gray-600/70 transition-all duration-500 group hover:scale-[1.02] shadow-2xl">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">Vote on Usage</h3>
                  <p className="text-gray-400 text-sm">Democratic data decisions</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="bg-red-500/10 rounded-lg p-4 border border-red-500/20">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
                      <Target className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-red-400 font-semibold">Proposal Voting</span>
                  </div>
                  <p className="text-gray-300 text-sm">Vote on data licensing partnerships and usage policies</p>
                </div>
                
                <div className="bg-pink-500/10 rounded-lg p-4 border border-pink-500/20">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-pink-500 rounded-lg flex items-center justify-center">
                      <Shield className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-pink-400 font-semibold">Snapshot Protocol</span>
                  </div>
                  <p className="text-gray-300 text-sm">Gas-free voting with full transparency and immutable records</p>
                </div>
              </div>
            </Card>
            
            <Card className="bg-gradient-to-br from-gray-900/90 to-gray-800/50 backdrop-blur-xl border border-gray-700/50 p-8 hover:border-gray-600/70 transition-all duration-500 group hover:scale-[1.02] shadow-2xl">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Coins className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">Earn Token Rewards</h3>
                  <p className="text-gray-400 text-sm">Value-based compensation</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="bg-red-500/10 rounded-lg p-4 border border-red-500/20">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
                      <Wallet className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-red-400 font-semibold">TubeDAO Tokens</span>
                  </div>
                  <p className="text-gray-300 text-sm">Earn tokens when your data is licensed to researchers and brands</p>
                </div>
                
                <div className="bg-pink-500/10 rounded-lg p-4 border border-pink-500/20">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-pink-500 rounded-lg flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-pink-400 font-semibold">Premium Multipliers</span>
                  </div>
                  <p className="text-gray-300 text-sm">Higher rewards for unique data patterns and longer contribution history</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Call to Action */}
          <div className="text-center mt-16 sm:mt-20">
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-6">
              Ready to Start Earning?
            </h3>
            <p className="text-lg sm:text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join hundreds of smart viewers who are already getting paid for their YouTube habits.
            </p>
            <WaitlistForm 
              variant="modal" 
              triggerText="Start Earning TDAO Tokens"
              triggerClassName="text-base sm:text-lg lg:text-xl px-8 sm:px-10 lg:px-12 py-4 sm:py-5 lg:py-6 bg-gradient-to-r from-red-500 to-purple-600 hover:from-red-600 hover:to-purple-700 text-white font-black shadow-2xl hover:shadow-red-500/50 transform hover:scale-105"
            />
          </div>
        </div>
      </section>
    </Layout>
  );
}
