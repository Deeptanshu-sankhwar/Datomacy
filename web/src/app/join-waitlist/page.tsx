"use client";

import { Card } from "@/components/ui/card";
import { WaitlistForm } from '@/components/WaitlistForm';
import Layout from '@/components/Layout';
import { 
  Users, 
  Coins,
  Target,
  Shield,
  Clock,
  TrendingUp
} from "lucide-react";

export default function JoinWaitlistPage() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-16 sm:py-24 lg:py-32 relative">
        <div className="container mx-auto px-4 sm:px-6 max-w-6xl text-center">
          <div className="max-w-4xl mx-auto">
            {/* Urgency Badge */}
            <div className="inline-flex items-center gap-4 bg-red-500/20 border border-red-500/30 rounded-full px-6 py-3 mb-8">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-white font-bold text-sm sm:text-base">LIVE: 47 spots remaining for exclusive airdrop</span>
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-6 sm:mb-8 text-white">
              Join the Next Generation
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl text-gray-300 mb-6 leading-relaxed">
              Own your digital footprint. For real.
            </p>
            <p className="text-base sm:text-lg lg:text-xl text-gray-400 mb-12 sm:mb-16">
              TubeDAO is launching soon. Get early access to revolutionary data ownership.
            </p>
          </div>
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="py-16 sm:py-24 lg:py-32 bg-gradient-to-b from-transparent to-gray-900/20">
        <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-16">
            <div className="text-center group">
              <div className="w-16 h-16 sm:w-18 sm:h-18 lg:w-20 lg:h-20 bg-gradient-to-br from-red-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-red-500/25">
                <Users className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white mb-3">Private DAO Voting Rights</h3>
              <p className="text-gray-300 text-sm sm:text-base">Shape data licensing decisions with exclusive voting power via Snapshot</p>
            </div>
            
            <div className="text-center group">
              <div className="w-16 h-16 sm:w-18 sm:h-18 lg:w-20 lg:h-20 bg-gradient-to-br from-red-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-red-500/25">
                <Coins className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white mb-3">Exclusive Token Airdrop</h3>
              <p className="text-gray-300 text-sm sm:text-base">First 300 contributors get exclusive TDAO token airdrop</p>
            </div>
            
            <div className="text-center group sm:col-span-2 lg:col-span-1">
              <div className="w-16 h-16 sm:w-18 sm:h-18 lg:w-20 lg:h-20 bg-gradient-to-br from-red-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-red-500/25">
                <Target className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white mb-3">Cross-DAO Identity</h3>
              <p className="text-gray-300 text-sm sm:text-base">Reusable digital identity for other Vana DAOs and Web3 platforms</p>
            </div>
          </div>
        </div>
      </section>

      {/* Urgency/Scarcity Section */}
      <section className="py-16 sm:py-24 lg:py-32 bg-gradient-to-b from-gray-900/20 to-transparent">
        <div className="container mx-auto px-4 sm:px-6 max-w-4xl text-center">
          <div className="bg-gradient-to-r from-red-500/20 to-pink-500/20 rounded-3xl p-6 sm:p-8 lg:p-12 border border-red-500/30 mb-8 sm:mb-12 relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute top-0 left-0 w-full h-full">
              <div className="absolute top-4 right-4 w-3 h-3 bg-red-400 rounded-full animate-pulse"></div>
              <div className="absolute bottom-6 left-6 w-2 h-2 bg-pink-400 rounded-full animate-bounce"></div>
              <div className="absolute top-1/2 left-4 w-1 h-1 bg-red-300 rounded-full animate-ping"></div>
            </div>
            
            <div className="relative z-10 text-center">
              <div className="flex items-center justify-center gap-2 mb-4 sm:mb-6">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-white">Limited Time: Early Contributors Get Exclusive Token Airdrop</h3>
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              </div>
              
              <div className="max-w-4xl mx-auto mb-6 sm:mb-8">
                <p className="text-base sm:text-lg lg:text-xl text-gray-200 leading-relaxed mb-4">
                  <span className="text-red-400 font-bold">Here&apos;s the deal:</span> The first <span className="text-red-400 font-bold">300 people</span> to join TubeDAO get an <span className="text-red-400 font-bold">exclusive token airdrop</span> at launch. <span className="text-white font-bold">Limited time only.</span>
                </p>
                <p className="text-base sm:text-lg lg:text-xl text-gray-200 leading-relaxed mb-4">
                  This means you get <span className="text-red-400 font-bold">free TDAO tokens</span> just for being early. Plus you earn more tokens from your ongoing YouTube data.
                </p>
                <p className="text-base sm:text-lg lg:text-xl text-gray-200 leading-relaxed mb-6">
                  But here&apos;s the catch - once we hit 300 early contributors, this airdrop <span className="text-red-400 font-bold">disappears</span>. No extensions. No exceptions.
                </p>
                
                {/* Spots remaining */}
                <div className="bg-black/30 rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8 border border-red-500/30">
                  <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-red-400 mb-2">47</div>
                  <p className="text-base sm:text-lg text-gray-300">spots remain as of today</p>
                </div>
                
                <p className="text-base sm:text-lg lg:text-xl text-white font-medium mb-8">
                  Don&apos;t let someone else take the spot that could get you <span className="text-red-400 font-bold">free airdrop tokens</span>.
                </p>
              </div>
              
              <WaitlistForm 
                variant="modal" 
                triggerText="Claim My Airdrop Spot"
                triggerClassName="text-base sm:text-lg lg:text-xl px-8 sm:px-10 lg:px-12 py-4 sm:py-5 lg:py-6 w-full sm:w-auto bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-black shadow-2xl hover:shadow-red-500/50 transform hover:scale-105"
              />
            </div>
          </div>
        </div>
      </section>

      {/* What You Get */}
      <section className="py-16 sm:py-24 lg:py-32 bg-gradient-to-b from-purple-900/10 to-gray-900/20">
        <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black mb-6 sm:mb-8 text-white">
              What You Get as an <span className="text-red-400">Early Contributor</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12">
            <Card className="bg-gradient-to-br from-red-500/10 to-pink-500/5 backdrop-blur-xl border border-red-500/20 p-6 sm:p-8 hover:border-red-400/50 transition-all duration-500 hover:scale-[1.02] shadow-2xl">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <Coins className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white">Immediate Token Airdrop</h3>
              </div>
              <div className="space-y-4">
                <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
                  <span className="text-white font-bold">Free TDAO tokens</span> delivered to your wallet at launch. No purchase required, no strings attached.
                </p>
                <div className="bg-red-500/10 rounded-lg p-4 border border-red-500/20">
                  <h4 className="text-red-400 font-bold text-sm mb-2">Airdrop Details:</h4>
                  <div className="space-y-1 text-xs text-gray-300">
                    <div className="flex justify-between"><span>Eligibility:</span><span className="text-red-400 font-bold">First 300 users only</span></div>
                    <div className="flex justify-between"><span>Token amount:</span><span className="text-red-400 font-bold">TBD at launch</span></div>
                    <div className="flex justify-between"><span>Delivery:</span><span className="text-red-400 font-bold">Mainnet launch day</span></div>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="bg-gradient-to-br from-red-500/10 to-pink-500/5 backdrop-blur-xl border border-red-500/20 p-6 sm:p-8 hover:border-red-400/50 transition-all duration-500 hover:scale-[1.02] shadow-2xl">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white">Exclusive Early Access</h3>
              </div>
              <div className="space-y-4">
                <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
                  <span className="text-white font-bold">Be the first</span> to experience TubeDAO&apos;s revolutionary data ownership platform.
                </p>
                <div className="space-y-2 text-sm text-gray-300">
                  <div className="flex items-center"><span className="text-red-400 mr-2">•</span>Beta access to Chrome extension</div>
                  <div className="flex items-center"><span className="text-red-400 mr-2">•</span>Priority data upload & validation</div>
                  <div className="flex items-center"><span className="text-red-400 mr-2">•</span>Exclusive community Discord access</div>
                  <div className="flex items-center"><span className="text-red-400 mr-2">•</span>Direct feedback line to founders</div>
                </div>
              </div>
            </Card>

            <Card className="bg-gradient-to-br from-red-500/10 to-pink-500/5 backdrop-blur-xl border border-red-500/20 p-6 sm:p-8 hover:border-red-400/50 transition-all duration-500 hover:scale-[1.02] shadow-2xl">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white">Governance Voting Power</h3>
              </div>
              <div className="space-y-4">
                <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
                  <span className="text-white font-bold">Shape the future</span> of TubeDAO with your voice in critical decisions.
                </p>
                <div className="space-y-2 text-sm text-gray-300">
                  <div className="flex items-center"><span className="text-red-400 mr-2">•</span>Vote on data licensing partnerships</div>
                  <div className="flex items-center"><span className="text-red-400 mr-2">•</span>Influence token economics & rewards</div>
                  <div className="flex items-center"><span className="text-red-400 mr-2">•</span>Guide platform development priorities</div>
                  <div className="flex items-center"><span className="text-red-400 mr-2">•</span>Approve new data usage policies</div>
                </div>
              </div>
            </Card>

            <Card className="bg-gradient-to-br from-red-500/10 to-pink-500/5 backdrop-blur-xl border border-red-500/20 p-6 sm:p-8 hover:border-red-400/50 transition-all duration-500 hover:scale-[1.02] shadow-2xl">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white">Higher Earning Potential</h3>
              </div>
              <div className="space-y-4">
                <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
                  <span className="text-white font-bold">Early contributors</span> get premium rewards and multipliers for longer participation history.
                </p>
                <div className="bg-red-500/10 rounded-lg p-4 border border-red-500/20">
                  <h4 className="text-red-400 font-bold text-sm mb-2">Earning Bonuses:</h4>
                  <div className="space-y-1 text-xs text-gray-300">
                    <div className="flex justify-between"><span>Founding member status:</span><span className="text-red-400 font-bold">Permanent badge</span></div>
                    <div className="flex justify-between"><span>Historical data value:</span><span className="text-red-400 font-bold">Higher rewards</span></div>
                    <div className="flex justify-between"><span>Loyalty multipliers:</span><span className="text-red-400 font-bold">Up to 2x earnings</span></div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-16 sm:py-24 lg:py-32 bg-gradient-to-b from-transparent to-red-900/20">
        <div className="container mx-auto px-4 sm:px-6 max-w-4xl text-center">
          <div className="bg-gradient-to-r from-red-500/20 to-pink-500/20 rounded-3xl p-6 sm:p-8 lg:p-12 border border-red-500/30 relative overflow-hidden">
            <div className="relative z-10 text-center max-w-3xl mx-auto">
              {/* Visual comparison */}
              <div className="grid grid-cols-2 gap-8 mb-8">
                <div className="text-center">
                  <div className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-400 mb-2">$0</div>
                  <p className="text-gray-400 text-sm sm:text-base">What you earn now</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl sm:text-5xl lg:text-6xl font-black text-red-400 mb-2">$600+</div>
                  <p className="text-red-400 text-sm sm:text-base">What you could earn yearly</p>
                </div>
              </div>
              
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-4 leading-tight">
                Your YouTube Data Has Made Billions for Others.<br />
                <span className="text-red-400">Now Make It Work for You.</span>
              </h3>
              
              <p className="text-lg sm:text-xl text-gray-200 mb-8">
                Every day you wait is money left on the table. Your viewing data is creating value right now - for YouTube, for advertisers, for everyone except you.
              </p>
              
              <p className="text-base sm:text-lg text-gray-300 mb-8">
                The question isn&apos;t whether your data is valuable. The question is: Are you going to keep giving it away for free, or are you ready to get paid what you&apos;re worth?
              </p>
              
              <WaitlistForm 
                variant="modal" 
                triggerText="Start Earning TDAO Tokens Today"
                triggerClassName="text-base sm:text-lg lg:text-xl px-8 sm:px-10 lg:px-12 py-4 sm:py-5 lg:py-6 w-full sm:w-auto bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-black shadow-2xl hover:shadow-red-500/50 transform hover:scale-105 border-2 border-red-400/30 hover:border-red-400/50 mb-6"
              />
              
              <p className="text-sm text-gray-400">
                <Clock className="w-4 h-4 inline mr-2" />
                Join the data ownership revolution. Take back control of your digital footprint.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 sm:py-24 lg:py-32 bg-gradient-to-b from-gray-900/20 to-transparent">
        <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black mb-6 sm:mb-8 text-white">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-6">
            <Card className="bg-gradient-to-br from-gray-900/90 to-gray-800/50 backdrop-blur-xl border border-gray-700/50 p-6 sm:p-8">
              <h3 className="text-xl font-bold text-white mb-3">When does TubeDAO launch?</h3>
              <p className="text-gray-300">TubeDAO is currently in development. Early contributors on the waitlist will get exclusive access to the beta and be the first to know about the official launch date.</p>
            </Card>

            <Card className="bg-gradient-to-br from-gray-900/90 to-gray-800/50 backdrop-blur-xl border border-gray-700/50 p-6 sm:p-8">
              <h3 className="text-xl font-bold text-white mb-3">Is my YouTube data really private?</h3>
              <p className="text-gray-300">Absolutely. All data is processed locally on your device and anonymized before any insights are shared. Your raw, personal data never leaves your control, and all computation happens within Vana&apos;s secure runtime environment.</p>
            </Card>

            <Card className="bg-gradient-to-br from-gray-900/90 to-gray-800/50 backdrop-blur-xl border border-gray-700/50 p-6 sm:p-8">
              <h3 className="text-xl font-bold text-white mb-3">How much can I actually earn?</h3>
              <p className="text-gray-300">Earnings depend on your YouTube usage patterns and the value your data creates. Early estimates suggest $15-50+ monthly for average users, with potential for $180-600+ annually. Actual earnings will be determined by market demand for insights.</p>
            </Card>

            <Card className="bg-gradient-to-br from-gray-900/90 to-gray-800/50 backdrop-blur-xl border border-gray-700/50 p-6 sm:p-8">
              <h3 className="text-xl font-bold text-white mb-3">What makes TubeDAO different from other data platforms?</h3>
              <p className="text-gray-300">TubeDAO is the first platform that combines YouTube&apos;s historical data (via Google Takeout) with real-time behavioral insights (via Chrome extension) while ensuring complete user privacy and ownership through blockchain governance.</p>
            </Card>
          </div>
        </div>
      </section>
    </Layout>
  );
}
