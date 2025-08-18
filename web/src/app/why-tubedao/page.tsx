"use client";

import { Card } from "@/components/ui/card";
import { WaitlistForm } from '@/components/WaitlistForm';
import Layout from '@/components/Layout';
import { 
  Shield, 
  Eye,
  Wallet,
  CheckCircle,
  DollarSign,
  TrendingUp,
  Users
} from "lucide-react";

export default function WhyTubeDAOPage() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-16 sm:py-24 lg:py-32 relative">
        <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
          <div className="text-center mb-12 sm:mb-16 lg:mb-20">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-6 sm:mb-8 text-white">
              The Side Hustle You&apos;re Already Doing<br />
              <span className="text-gray-400">(Without Getting Paid)</span>
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed px-4">
              Every video you watch generates <span className="text-yellow-400 font-bold">$240+ billion annually</span> for YouTube.<br className="hidden sm:block" />
              <span className="text-white font-medium">Now it&apos;s time you got your share.</span>
            </p>
          </div>

          {/* Visual comparison */}
          <div className="max-w-4xl mx-auto mb-16 sm:mb-20">
            <div className="grid grid-cols-2 gap-8 sm:gap-12">
              <div className="text-center p-6 sm:p-8 bg-gradient-to-br from-gray-500/10 to-gray-600/5 rounded-3xl border border-gray-500/20">
                <div className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-400 mb-4">$0</div>
                <p className="text-gray-400 text-sm sm:text-base font-medium">What you earn now from watching YouTube</p>
                <p className="text-gray-500 text-xs mt-2">Despite creating all the valuable data</p>
              </div>
              <div className="text-center p-6 sm:p-8 bg-gradient-to-br from-green-500/10 to-emerald-500/5 rounded-3xl border border-green-500/20">
                <div className="text-4xl sm:text-5xl lg:text-6xl font-black text-green-400 mb-4">$600+</div>
                <p className="text-green-400 text-sm sm:text-base font-medium">What you could earn yearly with TubeDAO</p>
                <p className="text-green-300 text-xs mt-2">Just from your normal viewing habits</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why It Matters */}
      <section className="py-16 sm:py-24 lg:py-32 bg-gradient-to-b from-gray-900/20 to-red-900/10 relative">
        <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
          <div className="text-center mb-12 sm:mb-16 lg:mb-20">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black mb-6 sm:mb-8 text-white">
              Why It Matters
            </h2>
            <p className="text-lg sm:text-xl lg:text-2xl text-gray-300 max-w-3xl mx-auto">
              The data economy is massive, and you&apos;ve been excluded from it. Until now.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 sm:gap-16">
            <div className="space-y-8 sm:space-y-12">
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
            
            <div className="space-y-8 sm:space-y-12">
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

      {/* The Problem */}
      <section className="py-16 sm:py-24 lg:py-32 bg-gradient-to-b from-transparent to-gray-900/20">
        <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black mb-6 sm:mb-8 text-white">
              The <span className="text-red-400">$240B Problem</span>
            </h2>
            <p className="text-lg sm:text-xl lg:text-2xl text-gray-300 max-w-3xl mx-auto">
              You&apos;re creating massive value. Others are profiting. You&apos;re getting nothing.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-12 mb-16">
            <Card className="bg-gradient-to-br from-red-500/10 to-pink-500/5 backdrop-blur-xl border border-red-500/20 p-6 sm:p-8 text-center">
              <DollarSign className="w-16 h-16 mx-auto mb-6 text-red-400" />
              <h3 className="text-2xl font-bold text-white mb-4">YouTube&apos;s Revenue</h3>
              <div className="text-4xl font-black text-red-400 mb-2">$28.8B</div>
              <p className="text-gray-300 text-sm">From ads alone in 2023</p>
              <p className="text-red-400 text-xs mt-2 font-medium">Built on YOUR viewing data</p>
            </Card>

            <Card className="bg-gradient-to-br from-yellow-500/10 to-orange-500/5 backdrop-blur-xl border border-yellow-500/20 p-6 sm:p-8 text-center">
              <TrendingUp className="w-16 h-16 mx-auto mb-6 text-yellow-400" />
              <h3 className="text-2xl font-bold text-white mb-4">Creator Earnings</h3>
              <div className="text-4xl font-black text-yellow-400 mb-2">$15B+</div>
              <p className="text-gray-300 text-sm">Paid to creators yearly</p>
              <p className="text-yellow-400 text-xs mt-2 font-medium">For content YOU watch</p>
            </Card>

            <Card className="bg-gradient-to-br from-gray-500/10 to-gray-600/5 backdrop-blur-xl border border-gray-500/20 p-6 sm:p-8 text-center">
              <Users className="w-16 h-16 mx-auto mb-6 text-gray-400" />
              <h3 className="text-2xl font-bold text-white mb-4">Your Earnings</h3>
              <div className="text-4xl font-black text-gray-400 mb-2">$0</div>
              <p className="text-gray-300 text-sm">Despite being the foundation</p>
              <p className="text-gray-400 text-xs mt-2 font-medium">No compensation for YOUR data</p>
            </Card>
          </div>

          <div className="bg-gradient-to-r from-red-500/10 to-purple-500/10 rounded-3xl p-8 sm:p-12 border border-red-500/20 text-center">
            <h3 className="text-3xl sm:text-4xl font-black text-white mb-6">
              This Changes Today
            </h3>
            <p className="text-lg sm:text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              TubeDAO flips the script. Instead of being exploited for your data, 
              you become a stakeholder in the value you create. Your viewing habits, 
              your preferences, your engagement patterns - <span className="text-white font-bold">they all have value, and now that value comes back to you.</span>
            </p>
            <WaitlistForm 
              variant="modal" 
              triggerText="Start Getting My Fair Share"
              triggerClassName="text-base sm:text-lg lg:text-xl px-8 sm:px-10 lg:px-12 py-4 sm:py-5 lg:py-6 bg-gradient-to-r from-red-500 to-purple-600 hover:from-red-600 hover:to-purple-700 text-white font-black shadow-2xl hover:shadow-red-500/50 transform hover:scale-105"
            />
          </div>
        </div>
      </section>

    </Layout>
  );
}
