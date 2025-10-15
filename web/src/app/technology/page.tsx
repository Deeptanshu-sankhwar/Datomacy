"use client";

import { Card } from "@/components/ui/card";
import { WaitlistForm } from '@/components/WaitlistForm';
import Layout from '@/components/Layout';
import { 
  Shield, 
  Brain,
  FileText,
  Eye,
  Cpu
} from "lucide-react";

export default function TechnologyPage() {
  return (
    <Layout>
      <div className="min-h-screen bg-background text-foreground">
        {/* Hero Section */}
        <section className="py-16 sm:py-24 lg:py-32 relative">
        <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
          <div className="text-center mb-12 sm:mb-16 lg:mb-20">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-6 sm:mb-8 text-foreground">
              <span className="text-primary">Real-Time</span> Intent Data <span className="text-accent">Intelligence</span>
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed px-4">
              Comprehensive behavioral tracking that captures complete user journeys across the web
            </p>
          </div>
        </div>
      </section>

      {/* Built on Real Data */}
      <section className="py-16 sm:py-24 lg:py-32 bg-gradient-to-b from-accent/10 to-transparent">
        <div className="container mx-auto px-4 sm:px-6 max-w-6xl">          
          <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Behavioral Data Collection */}
            <Card className="bg-gradient-to-br from-primary/10 to-accent/5 backdrop-blur-xl border border-primary/20 p-8 hover:border-primary/50 transition-all duration-500 hover:scale-105">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-primary/25">
                  <FileText className="w-10 h-10 text-foreground" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-4">Behavioral Data Collection</h3>
                <p className="text-primary font-semibold mb-4">(Chrome Extension)</p>
              </div>
              
              <div className="space-y-4 text-muted-foreground">
                <p className="text-lg leading-relaxed">Comprehensive tracking across all websites:</p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center"><span className="text-primary mr-2">•</span> Complete browsing history & patterns</li>
                  <li className="flex items-center"><span className="text-primary mr-2">•</span> Search queries & click behavior</li>
                  <li className="flex items-center"><span className="text-primary mr-2">•</span> Page engagement & scroll depth</li>
                  <li className="flex items-center"><span className="text-primary mr-2">•</span> Time spent on sites & content</li>
                  <li className="flex items-center"><span className="text-primary mr-2">•</span> Form interactions & conversions</li>
                </ul>
                <p className="text-xs text-muted-foreground italic mt-4">
                  Real-time capture of complete digital journeys across the web
                </p>
              </div>
            </Card>
            
            {/* Intent Analysis & Processing */}
            <Card className="bg-gradient-to-br from-primary/10 to-accent/5 backdrop-blur-xl border border-primary/20 p-8 hover:border-primary/50 transition-all duration-500 hover:scale-105">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-primary/25">
                  <Brain className="w-10 h-10 text-foreground" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-4">Intent Analysis & Processing</h3>
                <p className="text-primary font-semibold mb-4">(Powered by AI)</p>
              </div>
              
              <div className="space-y-4 text-muted-foreground">
                <p className="text-lg leading-relaxed">Transform raw data into actionable insights:</p>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start">
                    <span className="text-primary mr-2 mt-1">🎯</span>
                    <div>
                      <strong>Purchase intent signals</strong>
                      <p className="text-muted-foreground">Identify when users are ready to buy</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <span className="text-primary mr-2 mt-1">📊</span>
                    <div>
                      <strong>Interest categorization</strong>
                      <p className="text-muted-foreground">Understand user preferences & trends</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <span className="text-primary mr-2 mt-1">⚡</span>
                    <div>
                      <strong>Real-time processing</strong>
                      <p className="text-muted-foreground">Immediate insights for enterprises</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
          
          {/* Value Proposition Footer */}
          <div className="mt-16 bg-gradient-to-r from-primary/10 to-accent/10 rounded-3xl p-8 border border-primary/20 text-center">
            <h3 className="text-3xl font-bold text-foreground mb-4">Comprehensive Intent Data Intelligence</h3>
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              By combining <span className="text-primary font-semibold">behavioral tracking</span> with <span className="text-accent font-semibold">AI-powered analysis</span>, 
              Datomacy delivers enterprise-grade intent data — 
              rewarding users with tokens while providing businesses with actionable consumer insights.
            </p>
          </div>
        </div>
      </section>

      {/* Platform Features */}
      <section className="py-16 sm:py-24 lg:py-32 bg-gradient-to-b from-muted/20 to-transparent">
        <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black mb-6 sm:mb-8 text-foreground">
              Platform <span className="text-primary">Features</span>
            </h2>
            <p className="text-lg sm:text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto">
              Built for scale, designed for enterprise-grade data intelligence
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div className="bg-gradient-to-br from-primary/10 to-accent/5 rounded-2xl p-8 border border-primary/20">
                <h3 className="text-2xl font-bold text-foreground mb-6 flex items-center">
                  <Cpu className="w-8 h-8 mr-3 text-primary" />
                  Real-Time Data Processing
                </h3>
                <div className="space-y-4 text-muted-foreground">
                  <p><strong>Instant data capture and analysis</strong> across millions of user sessions simultaneously.</p>
                  <p>Our infrastructure processes behavioral data in real-time, delivering fresh insights to enterprises when they need them most.</p>
                  <p className="text-primary text-sm font-medium">✓ Sub-second latency for data ingestion</p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-primary/10 to-accent/5 rounded-2xl p-8 border border-primary/20">
                <h3 className="text-2xl font-bold text-foreground mb-6 flex items-center">
                  <Brain className="w-8 h-8 mr-3 text-primary" />
                  AI-Powered Intent Analysis
                </h3>
                <div className="space-y-4 text-muted-foreground">
                  <p><strong>Machine learning models</strong> identify purchase signals, interest patterns, and behavioral trends from raw browsing data.</p>
                  <p>Transform clicks into actionable business intelligence that drives ROI for enterprise clients.</p>
                  <p className="text-primary text-sm font-medium">✓ 95%+ accuracy in intent prediction</p>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="bg-gradient-to-br from-primary/10 to-accent/5 rounded-2xl p-8 border border-primary/20">
                <h3 className="text-2xl font-bold text-foreground mb-6 flex items-center">
                  <Shield className="w-8 h-8 mr-3 text-primary" />
                  Scalable Infrastructure
                </h3>
                <div className="space-y-4 text-muted-foreground">
                  <p><strong>Enterprise-grade architecture</strong> designed to handle millions of data points per second with 99.9% uptime.</p>
                  <p>Cloud-native deployment ensures reliable data collection and processing at any scale.</p>
                  <p className="text-primary text-sm font-medium">✓ Handles billions of events monthly</p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-primary/10 to-accent/5 rounded-2xl p-8 border border-primary/20">
                <h3 className="text-2xl font-bold text-foreground mb-6 flex items-center">
                  <Eye className="w-8 h-8 mr-3 text-primary" />
                  User Dashboard & Controls
                </h3>
                <div className="space-y-4 text-muted-foreground">
                  <p><strong>Transparent contribution tracking</strong> allows users to see their data activity and token rewards in real-time.</p>
                  <p>Simple controls to pause or resume data collection whenever you choose.</p>
                  <p className="text-primary text-sm font-medium">✓ Full transparency and control</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-16 text-center">
            <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-3xl p-8 border border-primary/20">
              <h3 className="text-3xl font-bold text-foreground mb-4">Ready to Contribute?</h3>
              <p className="text-xl text-muted-foreground mb-6 max-w-3xl mx-auto">
                Join the data economy and start earning token rewards for your browsing activity.
              </p>
              <WaitlistForm 
                variant="modal" 
                triggerText="Start Contributing"
                triggerClassName="text-base sm:text-lg lg:text-xl px-8 sm:px-10 lg:px-12 py-4 sm:py-5 lg:py-6 bg-gradient-to-r from-primary to-accent hover:from-primary/80 hover:to-accent/80 text-white font-black shadow-2xl hover:shadow-primary/50 transform hover:scale-105"
              />
            </div>
          </div>
        </div>
      </section>
      </div>
    </Layout>
  );
}
