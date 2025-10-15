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
      <div className="min-h-screen bg-background text-foreground">
        {/* Hero Section */}
        <section className="py-16 sm:py-24 lg:py-32 relative">
        <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
          <div className="text-center mb-12 sm:mb-16 lg:mb-20">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-6 sm:mb-8 text-foreground">
              Start Contributing in <span className="text-primary">5 Minutes</span>
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Simple setup. Start earning token rewards from your browsing activity today.
            </p>
          </div>
          
          {/* Visual Timeline */}
          <div className="relative">
            <div className="grid md:grid-cols-4 gap-8">
              {[
                { 
                  step: "01", 
                  title: "Install Extension", 
                  desc: "Download our Chrome extension (30 seconds)", 
                  icon: Wallet, 
                  detail: "Connect your wallet or create one - simple setup with guided walkthrough",
                  tooltip: "Quick and easy setup"
                },
                { 
                  step: "02", 
                  title: "Browse the Web Normally", 
                  desc: "Continue your regular internet activity", 
                  icon: Play, 
                  detail: "Use the internet as you always do. Our extension captures your behavioral data across all sites",
                  tooltip: "Zero changes to your routine"
                },
                { 
                  step: "03", 
                  title: "Earn DMCY Tokens", 
                  desc: "Get rewarded when your data creates value", 
                  icon: Coins, 
                  detail: "When your data helps enterprises understand consumer intent, you earn token rewards automatically",
                  tooltip: "Activity-based rewards"
                },
                { 
                  step: "04", 
                  title: "Manage Your Rewards", 
                  desc: "Your tokens have real value", 
                  icon: Target, 
                  detail: "Trade them, hold for governance votes, or reinvest. You're now a data economy stakeholder",
                  tooltip: "Real value from your browsing"
                }
              ].map((item, index) => (
                <div key={index} className="text-center group relative">
                  <div className="relative mb-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-primary/25 group-hover:scale-110 transition-all duration-300 group-hover:shadow-primary/40">
                      <item.icon className="w-10 h-10 text-foreground" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-background border border-primary/30 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-primary">{item.step}</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors duration-300">{item.title}</h3>
                  <p className="text-muted-foreground text-sm mb-3">{item.desc}</p>
                  <p className="text-muted-foreground text-xs leading-relaxed">{item.detail}</p>
                  
                  {/* Tooltip */}
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full bg-background/90 backdrop-blur-sm text-foreground text-xs px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap z-10">
                    {item.tooltip}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
        </div>
      </section>

      {/* How Datomacy Works */}
      <section className="py-16 sm:py-24 lg:py-32 relative bg-gradient-to-b from-transparent to-muted/20">
        <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
          <div className="text-center mb-12 sm:mb-16 lg:mb-20">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-6 sm:mb-8 text-foreground">
              How Datomacy <span className="text-primary">Actually Works</span>
            </h2>
            <p className="text-lg sm:text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed px-4">
              Two simple components working together to reward your data contributions.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 max-w-5xl mx-auto">
            <Card className="bg-gradient-to-br from-background to-muted/50 backdrop-blur-xl border border-border/50 p-8 hover:border-border/70 transition-all duration-500 group hover:scale-[1.02] shadow-2xl">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <FileText className="w-6 h-6 text-foreground" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-foreground">Contribute Your Data</h3>
                  <p className="text-muted-foreground text-sm">Comprehensive data capture</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="bg-primary/10 rounded-lg p-4 border border-primary/20">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                      <FileText className="w-4 h-4 text-foreground" />
                    </div>
                    <span className="text-primary font-semibold">Behavioral Patterns</span>
                  </div>
                  <p className="text-muted-foreground text-sm">Complete browsing history, clicks, searches, and engagement data</p>
                </div>
                
                <div className="bg-accent/10 rounded-lg p-4 border border-accent/20">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                      <Brain className="w-4 h-4 text-foreground" />
                    </div>
                    <span className="text-accent font-semibold">Chrome Extension</span>
                  </div>
                  <p className="text-muted-foreground text-sm">Real-time tracking across all websites and platforms</p>
                </div>
              </div>
            </Card>
            
            <Card className="bg-gradient-to-br from-background to-muted/50 backdrop-blur-xl border border-border/50 p-8 hover:border-border/70 transition-all duration-500 group hover:scale-[1.02] shadow-2xl">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Coins className="w-6 h-6 text-foreground" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-foreground">Earn Token Rewards</h3>
                  <p className="text-muted-foreground text-sm">Activity-based rewards</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="bg-primary/10 rounded-lg p-4 border border-primary/20">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                      <Wallet className="w-4 h-4 text-foreground" />
                    </div>
                    <span className="text-primary font-semibold">DMCY Tokens</span>
                  </div>
                  <p className="text-muted-foreground text-sm">Earn tokens when your data is licensed to enterprises</p>
                </div>
                
                <div className="bg-accent/10 rounded-lg p-4 border border-accent/20">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-foreground" />
                    </div>
                    <span className="text-accent font-semibold">Reward Multipliers</span>
                  </div>
                  <p className="text-muted-foreground text-sm">Higher rewards for quality data and consistent contributions</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Call to Action */}
          <div className="text-center mt-16 sm:mt-20">
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-foreground mb-6">
              Ready to Start Contributing?
            </h3>
            <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join contributors who are earning token rewards from their browsing activity.
            </p>
            <WaitlistForm 
              variant="modal" 
              triggerText="Start Earning DMCY Tokens"
              triggerClassName="text-base sm:text-lg lg:text-xl px-8 sm:px-10 lg:px-12 py-4 sm:py-5 lg:py-6 bg-gradient-to-r from-primary to-accent hover:from-primary/80 hover:to-accent/80 text-white font-black shadow-2xl hover:shadow-primary/50 transform hover:scale-105"
            />
          </div>
        </div>
      </section>
      </div>
    </Layout>
  );
}
