"use client";

import { WaitlistForm } from '@/components/WaitlistForm';
import Layout from '@/components/Layout';
import { 
  Shield, 
  Eye,
  Wallet,
  CheckCircle,
} from "lucide-react";

export default function WhyDatomacyPage() {
  return (
    <Layout>
      <div className="min-h-screen bg-background text-foreground">
        {/* Hero Section */}
        <section className="py-16 sm:py-24 lg:py-32 relative">
        <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
          <div className="text-center mb-12 sm:mb-16 lg:mb-20">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-6 sm:mb-8 text-foreground">
              Your Data Powers a<br />
              <span className="text-primary">$247 Billion Industry</span>
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed px-4">
              Every click, search, and browse reveals valuable consumer intent.<br className="hidden sm:block" />
              <span className="text-foreground font-medium">Get rewarded for the data you generate.</span>
            </p>
          </div>

          {/* Visual comparison */}
          <div className="max-w-4xl mx-auto mb-16 sm:mb-20">
            <div className="grid grid-cols-2 gap-8 sm:gap-12">
              <div className="text-center p-6 sm:p-8 bg-gradient-to-br from-gray-500/10 to-gray-600/5 rounded-3xl border border-gray-500/20">
                <div className="text-4xl sm:text-5xl lg:text-6xl font-black text-muted-foreground mb-4">$0</div>
                <p className="text-muted-foreground text-sm sm:text-base font-medium">What you earn now from browsing</p>
                <p className="text-muted-foreground text-xs mt-2">Despite generating valuable behavioral data</p>
              </div>
              <div className="text-center p-6 sm:p-8 bg-gradient-to-br from-primary/10 to-accent/5 rounded-3xl border border-primary/20">
                <div className="text-4xl sm:text-5xl lg:text-6xl font-black text-primary mb-4">Tokens</div>
                <p className="text-primary text-sm sm:text-base font-medium">What you earn with Datomacy</p>
                <p className="text-primary/80 text-xs mt-2">Activity-based DMCY token rewards</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Intent Data Market */}
      <section className="py-16 sm:py-24 lg:py-32 bg-gradient-to-b from-muted/20 to-primary/10 relative">
        <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black mb-6 sm:mb-8 text-foreground">
              Why <span className="text-primary">Datomacy</span> Exists
            </h2>
            <p className="text-lg sm:text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Enterprises spend billions on intent data. You generate it. You should be rewarded.
            </p>
          </div>

          {/* Why It Matters - Key Benefits */}
          <div className="grid md:grid-cols-2 gap-12 sm:gap-16 mb-16">
            <div className="space-y-8">
              <div className="flex items-start space-x-6 group">
                <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-sm shadow-primary/20">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-foreground mb-3">Deep Behavioral Intelligence</h3>
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    Comprehensive tracking across all websites reveals true consumer intent. From search patterns to engagement metrics, our platform captures the complete digital journey.
                  </p>
                  <p className="text-primary font-medium mt-2">✨ Real-time behavioral insights</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-6 group">
                <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-sm shadow-primary/20">
                  <Wallet className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-foreground mb-3">Fair Value Distribution</h3>
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    You generate the data, you earn the rewards. Token distribution scales with your contribution quality and consistency, creating a truly participatory data economy.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="space-y-8">
              <div className="flex items-start space-x-6 group">
                <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-sm shadow-primary/20">
                  <Eye className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-foreground mb-3">Enterprise-Grade Intent Data</h3>
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    Businesses get actionable insights into consumer behavior and purchasing intent. Real behavioral data that reveals what people actually do, not what they say they&apos;ll do.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-6 group">
                <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-sm shadow-primary/20">
                  <CheckCircle className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-foreground mb-3">Full Data Control</h3>
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    You decide when to contribute and when to pause. Data collection is transparent and you maintain control over your participation at all times.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* The Solution */}
          <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-3xl p-8 sm:p-12 border border-primary/20 text-center">
            <h3 className="text-3xl sm:text-4xl font-black text-foreground mb-6">
              Join the Data Economy
            </h3>
            <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
              Datomacy turns your browsing into an asset. Your behavioral data, 
              engagement patterns, and online activity - <span className="text-foreground font-bold">they create value for enterprises, and now you get rewarded for it.</span>
            </p>
            <WaitlistForm 
              variant="modal" 
              triggerText="Start Contributing"
              triggerClassName="text-base sm:text-lg lg:text-xl px-8 sm:px-10 lg:px-12 py-4 sm:py-5 lg:py-6 bg-gradient-to-r from-primary to-accent hover:from-primary/80 hover:to-accent/80 text-white font-black shadow-2xl hover:shadow-primary/50 transform hover:scale-105"
            />
          </div>
        </div>
      </section>
      </div>
    </Layout>
  );
}
