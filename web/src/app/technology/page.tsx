"use client";

import { Card } from "@/components/ui/card";
import { WaitlistForm } from '@/components/WaitlistForm';
import Layout from '@/components/Layout';
import { 
  Shield, 
  Brain,
  FileText,
  Lock,
  Eye,
  Cpu
} from "lucide-react";

export default function TechnologyPage() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-16 sm:py-24 lg:py-32 relative">
        <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
          <div className="text-center mb-12 sm:mb-16 lg:mb-20">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-6 sm:mb-8 text-white">
              Unlocking Unprecedented <span className="text-red-400">User Behavior</span> & <span className="text-pink-400">Ad Intelligence</span>
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed px-4">
              Our dual-source approach captures both foundational patterns and the deep, granular insights that drive real competitive advantage
            </p>
          </div>
        </div>
      </section>

      {/* Built on Real Data */}
      <section className="py-16 sm:py-24 lg:py-32 bg-gradient-to-b from-purple-900/10 to-transparent">
        <div className="container mx-auto px-4 sm:px-6 max-w-6xl">          
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Foundational Insights */}
            <Card className="bg-gradient-to-br from-red-500/10 to-pink-500/5 backdrop-blur-xl border border-red-500/20 p-8 hover:border-red-400/50 transition-all duration-500 hover:scale-105">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-red-500/25">
                  <FileText className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Foundational Insights</h3>
                <p className="text-red-400 font-semibold mb-4">(from Google Takeout)</p>
              </div>
              
              <div className="space-y-4 text-gray-300">
                <p className="text-lg leading-relaxed">Leverage your existing YouTube history:</p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center"><span className="text-red-400 mr-2">•</span> Watch patterns & viewing history</li>
                  <li className="flex items-center"><span className="text-red-400 mr-2">•</span> Search queries & interests</li>
                  <li className="flex items-center"><span className="text-red-400 mr-2">•</span> Subscribed channels & creators</li>
                  <li className="flex items-center"><span className="text-red-400 mr-2">•</span> Playlist preferences & organization</li>
                </ul>
                <p className="text-xs text-gray-400 italic mt-4">
                  Examples: &quot;Top Genres Watched,&quot; &quot;Favorite Creators,&quot; &quot;Content Discovery Patterns&quot;
                </p>
              </div>
            </Card>
            
            {/* Deep Dive Insights */}
            <Card className="bg-gradient-to-br from-red-500/10 to-pink-500/5 backdrop-blur-xl border border-red-500/20 p-8 hover:border-red-400/50 transition-all duration-500 hover:scale-105">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-red-500/25">
                  <Brain className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Deep Dive Insights</h3>
                <p className="text-red-400 font-semibold mb-4">(from Chrome Extension)</p>
              </div>
              
              <div className="space-y-4 text-gray-300">
                <p className="text-lg leading-relaxed">Our Chrome Extension captures the missing pieces:</p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center"><span className="text-red-400 mr-2">🎯</span> Premium feature usage patterns</li>
                  <li className="flex items-center"><span className="text-pink-400 mr-2">📺</span> Ad interaction & skip behavior</li>
                  <li className="flex items-center"><span className="text-red-400 mr-2">⚡</span> Real-time engagement metrics</li>
                  <li className="flex items-center"><span className="text-pink-400 mr-2">💡</span> Content stickiness insights</li>
                </ul>
                <p className="text-xs text-gray-400 italic mt-4">
                  Deep behavioral data that drives competitive advantage for creators and advertisers.
                </p>
              </div>
            </Card>
            
            {/* Privacy & Aggregation */}
            <Card className="bg-gradient-to-br from-red-500/10 to-pink-500/5 backdrop-blur-xl border border-red-500/20 p-8 hover:border-red-400/50 transition-all duration-500 hover:scale-105">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-red-500/25">
                  <Shield className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Privacy & Aggregation</h3>
                <p className="text-red-400 font-semibold mb-4">(Powered by Vana)</p>
              </div>
              
              <div className="space-y-4 text-gray-300">
                <p className="text-lg leading-relaxed">All data is anonymized and aggregated within <strong>Vana&apos;s Secure Runtime (TEEs)</strong>.</p>
                
                <div className="space-y-3 text-sm">
                  <div className="flex items-start">
                    <span className="text-red-400 mr-2 mt-1">🔒</span>
                    <div>
                      <strong>Your raw, personal data remains private</strong>
                      <p className="text-gray-400">Never exposed to TubeDAO or data buyers</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <span className="text-red-400 mr-2 mt-1">📊</span>
                    <div>
                      <strong>Collective insights made available</strong>
                      <p className="text-gray-400">For ethical research and AI training</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <span className="text-red-400 mr-2 mt-1">💰</span>
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
          <div className="mt-16 bg-gradient-to-r from-red-500/10 to-pink-500/10 rounded-3xl p-8 border border-red-500/20 text-center">
            <h3 className="text-3xl font-bold text-white mb-4">The Missing Piece of the Digital Economy</h3>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              By combining <span className="text-red-400 font-semibold">foundational data</span> with <span className="text-pink-400 font-semibold">granular behavioral insights</span>, 
              TubeDAO creates the most comprehensive and valuable dataset in the creator economy — 
              finally giving users ownership and fair compensation for their digital contributions.
            </p>
          </div>
        </div>
      </section>

      {/* Privacy Deep Dive */}
      <section className="py-16 sm:py-24 lg:py-32 bg-gradient-to-b from-gray-900/20 to-transparent">
        <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black mb-6 sm:mb-8 text-white">
              Privacy by <span className="text-red-400">Design</span>
            </h2>
            <p className="text-lg sm:text-xl lg:text-2xl text-gray-300 max-w-3xl mx-auto">
              Your data never leaves your control. Here&apos;s exactly how we ensure your privacy.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div className="bg-gradient-to-br from-red-500/10 to-pink-500/5 rounded-2xl p-8 border border-red-500/20">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <Lock className="w-8 h-8 mr-3 text-red-400" />
                  Local Data Processing
                </h3>
                <div className="space-y-4 text-gray-300">
                  <p><strong>Your raw data stays on your device</strong> until you explicitly choose to contribute anonymized insights.</p>
                  <p>The Chrome extension processes everything locally, ensuring no personal information ever leaves your computer without your consent.</p>
                  <p className="text-red-400 text-sm font-medium">✓ Zero server-side personal data storage</p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-red-500/10 to-pink-500/5 rounded-2xl p-8 border border-red-500/20">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <Shield className="w-8 h-8 mr-3 text-red-400" />
                  Anonymization Layer
                </h3>
                <div className="space-y-4 text-gray-300">
                  <p><strong>Advanced cryptographic techniques</strong> strip all personally identifiable information before any data leaves your device.</p>
                  <p>Your viewing patterns become anonymous statistical insights that can&apos;t be traced back to you individually.</p>
                  <p className="text-red-400 text-sm font-medium">✓ Mathematically proven privacy guarantees</p>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="bg-gradient-to-br from-red-500/10 to-pink-500/5 rounded-2xl p-8 border border-red-500/20">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <Cpu className="w-8 h-8 mr-3 text-red-400" />
                  Secure Computation
                </h3>
                <div className="space-y-4 text-gray-300">
                  <p><strong>Vana&apos;s Trusted Execution Environments</strong> ensure that even when data is being processed for insights, it remains encrypted and isolated.</p>
                  <p>No human or system can access your individual data during computation - only aggregated, anonymous results are produced.</p>
                  <p className="text-red-400 text-sm font-medium">✓ Hardware-level security guarantees</p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-red-500/10 to-pink-500/5 rounded-2xl p-8 border border-red-500/20">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <Eye className="w-8 h-8 mr-3 text-red-400" />
                  Full Transparency
                </h3>
                <div className="space-y-4 text-gray-300">
                  <p><strong>Open-source architecture</strong> means you can verify exactly how your data is being handled at every step.</p>
                  <p>All governance decisions about data usage are recorded on-chain and publicly auditable through the DAO structure.</p>
                  <p className="text-red-400 text-sm font-medium">✓ Verifiable privacy through code inspection</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-16 text-center">
            <div className="bg-gradient-to-r from-red-500/10 to-pink-500/10 rounded-3xl p-8 border border-red-500/20">
              <h3 className="text-3xl font-bold text-white mb-4">Your Data, Your Rules</h3>
              <p className="text-xl text-gray-300 mb-6 max-w-3xl mx-auto">
                You maintain complete control over what data you share, when you share it, and how it&apos;s used. 
                <span className="text-white font-bold"> Privacy isn&apos;t a feature - it&apos;s the foundation.</span>
              </p>
              <WaitlistForm 
                variant="modal" 
                triggerText="Join the Privacy Revolution"
                triggerClassName="text-base sm:text-lg lg:text-xl px-8 sm:px-10 lg:px-12 py-4 sm:py-5 lg:py-6 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-black shadow-2xl hover:shadow-red-500/50 transform hover:scale-105"
              />
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
