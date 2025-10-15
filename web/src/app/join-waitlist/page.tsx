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
      <div className="min-h-screen bg-background text-foreground">
        {/* Hero Section */}
        <section className="py-16 sm:py-24 lg:py-32 relative">
        <div className="container mx-auto px-4 sm:px-6 max-w-6xl text-center">
          <div className="max-w-4xl mx-auto">
            {/* Community Badge */}
            <div className="inline-flex items-center gap-4 bg-primary/20 border border-primary/30 rounded-full px-6 py-3 mb-8">
              <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
              <span className="text-foreground font-bold text-sm sm:text-base">LIVE: Join our growing community for early access</span>
              <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-6 sm:mb-8 text-foreground">
              Start Earning from Your Data
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl text-muted-foreground mb-6 leading-relaxed">
              Turn your browsing activity into token rewards.
            </p>
            <p className="text-base sm:text-lg lg:text-xl text-muted-foreground mb-12 sm:mb-16">
              Connect with our community to get early access to Datomacy and the latest product updates.
            </p>
          </div>
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="py-16 sm:py-24 lg:py-32 bg-gradient-to-b from-transparent to-muted/20">
        <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-16">
            <div className="text-center group">
              <div className="w-16 h-16 sm:w-18 sm:h-18 lg:w-20 lg:h-20 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-primary/25">
                <Users className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 text-foreground" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-foreground mb-3">Token Rewards</h3>
              <p className="text-muted-foreground text-sm sm:text-base">Earn DMCY tokens based on your browsing activity and data contributions</p>
            </div>
            
            <div className="text-center group">
              <div className="w-16 h-16 sm:w-18 sm:h-18 lg:w-20 lg:h-20 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-primary/25">
                <Coins className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 text-foreground" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-foreground mb-3">Early Access</h3>
              <p className="text-muted-foreground text-sm sm:text-base">Get priority access to new features and enhanced earning opportunities</p>
            </div>
            
            <div className="text-center group sm:col-span-2 lg:col-span-1">
              <div className="w-16 h-16 sm:w-18 sm:h-18 lg:w-20 lg:h-20 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-primary/25">
                <Target className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 text-foreground" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-foreground mb-3">Community Perks</h3>
              <p className="text-muted-foreground text-sm sm:text-base">Direct access to the team and exclusive updates on platform development</p>
            </div>
          </div>
        </div>
      </section>

      {/* Community Benefits Section */}
      <section className="py-16 sm:py-24 lg:py-32 bg-gradient-to-b from-muted/20 to-transparent">
        <div className="container mx-auto px-4 sm:px-6 max-w-4xl text-center">
          <div className="bg-gradient-to-r from-primary/20 to-accent/20 rounded-3xl p-6 sm:p-8 lg:p-12 border border-primary/30 mb-8 sm:mb-12 relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute top-0 left-0 w-full h-full">
              <div className="absolute top-4 right-4 w-3 h-3 bg-primary rounded-full animate-pulse"></div>
              <div className="absolute bottom-6 left-6 w-2 h-2 bg-accent rounded-full animate-bounce"></div>
              <div className="absolute top-1/2 left-4 w-1 h-1 bg-primary/80 rounded-full animate-ping"></div>
            </div>
            
            <div className="relative z-10 text-center">
              <div className="flex items-center justify-center gap-2 mb-4 sm:mb-6">
                <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-foreground">Join Our Discord Community for Exclusive Benefits</h3>
                <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
              </div>
              
              <div className="max-w-4xl mx-auto mb-6 sm:mb-8">
                <p className="text-base sm:text-lg lg:text-xl text-muted-foreground leading-relaxed mb-4">
                  <span className="text-primary font-bold">Here&apos;s what you get:</span> Join our growing Discord community to get <span className="text-primary font-bold">early access</span> to Datomacy features and <span className="text-foreground font-bold">priority support</span>.
                </p>
                <p className="text-base sm:text-lg lg:text-xl text-muted-foreground leading-relaxed mb-4">
                  Connect directly with our team, get the latest product updates, and be the first to know about new features and token reward opportunities.
                </p>
                <p className="text-base sm:text-lg lg:text-xl text-muted-foreground leading-relaxed mb-6">
                  Plus, active community members get <span className="text-primary font-bold">enhanced rewards</span> and priority access to beta features.
                </p>
              </div>
              
              <WaitlistForm 
                variant="modal" 
                triggerText="Join Our Community"
                triggerClassName="text-base sm:text-lg lg:text-xl px-8 sm:px-10 lg:px-12 py-4 sm:py-5 lg:py-6 w-full sm:w-auto bg-gradient-to-r from-primary to-accent hover:from-primary/80 hover:to-accent/80 text-foreground font-black shadow-2xl hover:shadow-primary/50 transform hover:scale-105"
              />
            </div>
          </div>
        </div>
      </section>

      {/* What You Get */}
      <section className="py-16 sm:py-24 lg:py-32 bg-gradient-to-b from-accent/10 to-muted/20">
        <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black mb-6 sm:mb-8 text-foreground">
              What You Get as a <span className="text-primary">Community Member</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12">
            <Card className="bg-gradient-to-br from-primary/10 to-accent/5 backdrop-blur-xl border border-primary/20 p-6 sm:p-8 hover:border-primary/50 transition-all duration-500 hover:scale-[1.02] shadow-2xl">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center">
                  <Coins className="w-6 h-6 text-foreground" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-foreground">Priority Product Access</h3>
              </div>
              <div className="space-y-4">
                <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
                  <span className="text-foreground font-bold">Early access</span> to new features and products before general release. Be among the first to experience Datomacy.
                </p>
                <div className="bg-primary/10 rounded-lg p-4 border border-primary/20">
                  <h4 className="text-primary font-bold text-sm mb-2">Access Benefits:</h4>
                  <div className="space-y-1 text-xs text-muted-foreground">
                    <div className="flex justify-between"><span>Beta testing:</span><span className="text-primary font-bold">First access to features</span></div>
                    <div className="flex justify-between"><span>Product updates:</span><span className="text-primary font-bold">Instant notifications</span></div>
                    <div className="flex justify-between"><span>Token rewards:</span><span className="text-primary font-bold">Enhanced earnings</span></div>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="bg-gradient-to-br from-primary/10 to-accent/5 backdrop-blur-xl border border-primary/20 p-6 sm:p-8 hover:border-primary/50 transition-all duration-500 hover:scale-[1.02] shadow-2xl">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center">
                  <Shield className="w-6 h-6 text-foreground" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-foreground">Exclusive Early Access</h3>
              </div>
              <div className="space-y-4">
                <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
                  <span className="text-foreground font-bold">Be the first</span> to experience Datomacy&apos;s intent data platform.
                </p>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center"><span className="text-primary mr-2">•</span>Beta access to Chrome extension</div>
                  <div className="flex items-center"><span className="text-primary mr-2">•</span>Early token reward opportunities</div>
                  <div className="flex items-center"><span className="text-primary mr-2">•</span>Exclusive community Discord access</div>
                  <div className="flex items-center"><span className="text-primary mr-2">•</span>Direct feedback line to founders</div>
                </div>
              </div>
            </Card>

            <Card className="bg-gradient-to-br from-primary/10 to-accent/5 backdrop-blur-xl border border-primary/20 p-6 sm:p-8 hover:border-primary/50 transition-all duration-500 hover:scale-[1.02] shadow-2xl">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-foreground" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-foreground">Governance Voting Power</h3>
              </div>
              <div className="space-y-4">
                <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
                  <span className="text-foreground font-bold">Influence the platform</span> and provide feedback on feature development.
                </p>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center"><span className="text-primary mr-2">•</span>Provide feedback on new features</div>
                  <div className="flex items-center"><span className="text-primary mr-2">•</span>Influence platform development priorities</div>
                  <div className="flex items-center"><span className="text-primary mr-2">•</span>Share ideas for reward enhancements</div>
                  <div className="flex items-center"><span className="text-primary mr-2">•</span>Help shape the user experience</div>
                </div>
              </div>
            </Card>

            <Card className="bg-gradient-to-br from-primary/10 to-accent/5 backdrop-blur-xl border border-primary/20 p-6 sm:p-8 hover:border-primary/50 transition-all duration-500 hover:scale-[1.02] shadow-2xl">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-foreground" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-foreground">Higher Earning Potential</h3>
              </div>
              <div className="space-y-4">
                <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
                  <span className="text-foreground font-bold">Community members</span> get enhanced rewards and benefits for active participation.
                </p>
                <div className="bg-primary/10 rounded-lg p-4 border border-primary/20">
                  <h4 className="text-primary font-bold text-sm mb-2">Member Benefits:</h4>
                  <div className="space-y-1 text-xs text-muted-foreground">
                    <div className="flex justify-between"><span>Community status:</span><span className="text-primary font-bold">Verified member badge</span></div>
                    <div className="flex justify-between"><span>Participation rewards:</span><span className="text-primary font-bold">Enhanced earnings</span></div>
                    <div className="flex justify-between"><span>Engagement bonuses:</span><span className="text-primary font-bold">Activity multipliers</span></div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-16 sm:py-24 lg:py-32 bg-gradient-to-b from-transparent to-muted/20">
        <div className="container mx-auto px-4 sm:px-6 max-w-4xl text-center">
          <div className="bg-gradient-to-r from-primary/20 to-accent/20 rounded-3xl p-6 sm:p-8 lg:p-12 border border-primary/30 relative overflow-hidden">
            <div className="relative z-10 text-center max-w-3xl mx-auto">
              {/* Visual comparison */}
              <div className="grid grid-cols-2 gap-8 mb-8">
                <div className="text-center">
                  <div className="text-4xl sm:text-5xl lg:text-6xl font-black text-muted-foreground mb-2">$0</div>
                  <p className="text-muted-foreground text-sm sm:text-base">What you earn now</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl sm:text-5xl lg:text-6xl font-black text-primary mb-2">$600+</div>
                  <p className="text-primary text-sm sm:text-base">What you could earn yearly</p>
                </div>
              </div>
              
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-foreground mb-4 leading-tight">
                Your Browsing Data Creates Value Every Day.<br />
                <span className="text-primary">Start Getting Rewarded for It.</span>
              </h3>
              
              <p className="text-lg sm:text-xl text-muted-foreground mb-8">
                Every click, search, and page view generates valuable intent data. Enterprises pay billions for these insights - now you can earn token rewards for contributing.
              </p>
              
              <p className="text-base sm:text-lg text-muted-foreground mb-8">
                Your behavioral data is valuable. Join Datomacy to turn your browsing activity into DMCY token rewards.
              </p>
              
              <WaitlistForm 
                variant="modal" 
                triggerText="Join Datomacy Community"
                triggerClassName="text-base sm:text-lg lg:text-xl px-8 sm:px-10 lg:px-12 py-4 sm:py-5 lg:py-6 w-full sm:w-auto bg-gradient-to-r from-primary to-accent hover:from-primary/80 hover:to-accent/80 text-white font-black shadow-2xl hover:shadow-primary/50 transform hover:scale-105 border-2 border-primary/30 hover:border-primary/50 mb-6"
              />
              
              <p className="text-sm text-muted-foreground">
                <Clock className="w-4 h-4 inline mr-2" />
                Start earning token rewards from your browsing activity today.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 sm:py-24 lg:py-32 bg-gradient-to-b from-muted/20 to-transparent">
        <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black mb-6 sm:mb-8 text-foreground">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-6">
            <Card className="bg-gradient-to-br from-background to-muted/50 backdrop-blur-xl border border-border/50 p-6 sm:p-8">
              <h3 className="text-xl font-bold text-foreground mb-3">When does Datomacy launch?</h3>
              <p className="text-muted-foreground">Datomacy is currently in development. Community members will get early access to beta features and be the first to know about the official launch date.</p>
            </Card>

            <Card className="bg-gradient-to-br from-background to-muted/50 backdrop-blur-xl border border-border/50 p-6 sm:p-8">
              <h3 className="text-xl font-bold text-foreground mb-3">What data does Datomacy collect?</h3>
              <p className="text-muted-foreground">Datomacy captures comprehensive behavioral data across all websites you visit, including browsing patterns, clicks, searches, and engagement metrics. This data is used to generate valuable intent insights for enterprises.</p>
            </Card>

            <Card className="bg-gradient-to-br from-background to-muted/50 backdrop-blur-xl border border-border/50 p-6 sm:p-8">
              <h3 className="text-xl font-bold text-foreground mb-3">How do I earn token rewards?</h3>
              <p className="text-muted-foreground">Token rewards are distributed based on your browsing activity and data contributions. More active browsing and quality data contributions result in higher DMCY token rewards. Rewards are calculated based on the value your data creates for enterprises.</p>
            </Card>

            <Card className="bg-gradient-to-br from-background to-muted/50 backdrop-blur-xl border border-border/50 p-6 sm:p-8">
              <h3 className="text-xl font-bold text-foreground mb-3">What makes Datomacy different from other data platforms?</h3>
              <p className="text-muted-foreground">Datomacy provides real-time, comprehensive behavioral tracking across all websites, not just one platform. Our AI-powered intent analysis delivers enterprise-grade insights while rewarding users with DMCY tokens for their contributions.</p>
            </Card>
          </div>
        </div>
      </section>
      </div>
    </Layout>
  );
}
