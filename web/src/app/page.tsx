"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import dynamic from 'next/dynamic';
import { Wallet } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from '@/hooks/useAuth';
import { InlineAuth } from '@/components/InlineAuth';
import { Play } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const WalletConnection = dynamic(
  () => import("@/components/WalletConnection").then((mod) => ({ default: mod.WalletConnection })),
  {
    ssr: false,
    loading: () => (
      <Button variant="outline" className="bg-background/10 border-border text-foreground hover:bg-background/20">
        <Wallet className="h-4 w-4 mr-2" />
        Connect Wallet
      </Button>
    )
  }
);

const Dashboard = dynamic(
  () => import("@/components/Dashboard").then((mod) => ({ default: mod.Dashboard })),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    )
  }
);

import { WaitlistForm } from '@/components/WaitlistForm';
import Layout from '@/components/Layout';
import Link from 'next/link';
import {
  Users,
  Coins,
  Target,
  ChevronDown,
  Github,
  Twitter,
  MessageCircle
} from "lucide-react";

export default function HomePage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return <ClientTubeDAO />;
}

function ClientTubeDAO() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const { isAuthenticated, token } = useAuth();

  // If user is authenticated, show the dashboard
  if (isAuthenticated) {
    return <Dashboard authToken={token} />;
  }

  return (
    <Layout showExitIntent={true}>
      <div className="min-h-screen bg-background text-foreground overflow-hidden">
        <header className="fixed top-0 right-0 z-50 p-6">
          <div className="flex items-center gap-4">
            <WalletConnection />
            <InlineAuth />
          </div>
        </header>

        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse"
            style={{ transform: `translateY(${scrollY * 0.5}px)` }}
          />
          <div
            className="absolute top-1/3 right-1/4 w-80 h-80 bg-accent/20 rounded-full blur-3xl animate-pulse delay-1000"
            style={{ transform: `translateY(${scrollY * 0.3}px)` }}
          />
          <div
            className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-accent/20 rounded-full blur-3xl animate-pulse delay-2000"
            style={{ transform: `translateY(${scrollY * 0.2}px)` }}
          />
        </div>

        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6">
          <div className="container mx-auto text-center max-w-6xl relative z-10">
            <div className="flex justify-center items-center mb-6 sm:mb-8">
              <Badge className="bg-gradient-to-r from-primary/20 to-accent/20 text-foreground border-primary/40 px-4 sm:px-6 lg:px-8 py-2 sm:py-3 text-xs sm:text-sm lg:text-base font-bold shadow-lg">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse mr-2 sm:mr-3"></div>
                <span className="hidden sm:inline">Enterprise Intent Data Platform • Real-Time Insights</span>
                <span className="sm:hidden">Intent Data Platform</span>
              </Badge>
            </div>

            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-black mb-6 sm:mb-8 tracking-tight">
              <span className="bg-gradient-to-r from-primary via-primary/80 to-accent bg-clip-text text-transparent">
                DATOMACY
              </span>
            </h1>

            <div className="max-w-4xl mx-auto mb-8 sm:mb-12 space-y-4 sm:space-y-6">
              <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-foreground mb-4 sm:mb-6 font-bold leading-tight">
                Get Rewarded for Your Browsing Data
              </p>
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground font-normal leading-relaxed">
                Every click, scroll, and search reveals consumer intent. That&apos;s worth <span className="text-foreground font-semibold">$247 billion</span><br />
                <span className="text-foreground font-semibold">Contribute your behavioral data and earn DMCY token rewards</span> based on your activity.
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:gap-6 lg:gap-8 justify-center items-center mb-12 sm:mb-16 max-w-4xl mx-auto">
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-center justify-center w-full">
              <WaitlistForm
                variant="modal"
                triggerText="Start Contributing"
                triggerClassName="text-base sm:text-lg lg:text-xl px-8 sm:px-10 lg:px-12 py-4 sm:py-5 lg:py-6 w-full sm:w-auto"
              />

                <Link href="/how-it-works">
                  <Button
                    size="lg"
                    className="bg-background/15 border border-border/50 text-foreground hover:bg-background/25 hover:border-border/70 px-6 sm:px-8 py-4 text-base sm:text-lg font-semibold backdrop-blur-md shadow-xl hover:shadow-2xl transition-all duration-300 w-full sm:w-auto"
                  >
                    <Play className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    How It Works
                  </Button>
                </Link>
              </div>
            </div>

            <p className="text-muted-foreground text-xs sm:text-sm">
              <Coins className="w-3 h-3 sm:w-4 sm:h-4 inline mr-2" />
              Simple setup • Rewards distributed in DMCY tokens
            </p>

            {/* Scroll indicator */}
            <div className="absolute bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
              <ChevronDown className="w-5 h-5 sm:w-6 sm:h-6 text-muted-foreground" />
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16 sm:py-24 lg:py-32 bg-gradient-to-b from-accent/10 to-muted/20 relative">
          <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
            <div className="text-center mb-8 sm:mb-12">
              <div className="inline-flex items-center gap-4 bg-primary/20 border border-primary/30 rounded-full px-6 py-3 mb-6">
                <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
                <span className="text-foreground font-bold text-sm sm:text-base">LIVE NOW: Contributors actively earning</span>
                <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-6 sm:mb-8 text-foreground">
                How <span className="text-primary">Datomacy</span> Works
              </h2>
              <p className="text-lg sm:text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto">
                Three simple steps to turn your browsing into earnings
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-12">
              <Card className="bg-gradient-to-br from-primary/10 to-accent/5 backdrop-blur-xl border border-primary/20 p-6 sm:p-8 hover:border-primary/50 transition-all duration-500 hover:scale-[1.02] shadow-2xl">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl font-black text-white">1</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-4">Browse Normally</h3>
                </div>
                <p className="text-muted-foreground text-base leading-relaxed text-center">
                  Install our extension and continue your regular internet activity. We capture your behavioral patterns—what you view, search, and engage with across the web.
                </p>
              </Card>

              <Card className="bg-gradient-to-br from-primary/10 to-accent/5 backdrop-blur-xl border border-primary/20 p-6 sm:p-8 hover:border-primary/50 transition-all duration-500 hover:scale-[1.02] shadow-2xl">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl font-black text-white">2</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-4">We Analyze Intent</h3>
                </div>
                <p className="text-muted-foreground text-base leading-relaxed text-center">
                  Your behavioral data is processed into intent signals—patterns that reveal market trends and consumer interests. This aggregated, anonymous data is what enterprises pay for.
                </p>
              </Card>

              <Card className="bg-gradient-to-br from-primary/10 to-accent/5 backdrop-blur-xl border border-primary/20 p-6 sm:p-8 hover:border-primary/50 transition-all duration-500 hover:scale-[1.02] shadow-2xl">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl font-black text-white">3</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-4">Earn Token Rewards</h3>
                </div>
                <p className="text-muted-foreground text-base leading-relaxed text-center mb-4">
                  When enterprises purchase intent data derived from your contributions, you receive DMCY token rewards. Rewards scale with your activity level and data quality.
                </p>
                <div className="mt-4 pt-4 border-t border-primary/20">
                  <div className="text-center space-y-2">
                    <p className="text-foreground font-bold text-lg">Activity-Based Rewards</p>
                    <p className="text-muted-foreground text-sm">More browsing = More tokens</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Value Proposition */}
            <div className="mt-16 sm:mt-20 grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="bg-gradient-to-br from-primary/10 to-accent/5 backdrop-blur-xl border border-primary/20 p-6 sm:p-8 hover:border-primary/50 transition-all duration-500 shadow-2xl">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-foreground">Complete Data Control</h3>
                </div>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    <span>Comprehensive behavioral tracking across all sites</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    <span>Real-time data processing and analysis</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    <span>Deep insights into user interests and intent</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    <span>Full control to pause or delete your data anytime</span>
                  </li>
                </ul>
              </Card>

              <Card className="bg-gradient-to-br from-primary/10 to-accent/5 backdrop-blur-xl border border-primary/20 p-6 sm:p-8 hover:border-primary/50 transition-all duration-500 shadow-2xl">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-foreground">The Intent Data Market</h3>
                </div>
                <p className="text-muted-foreground text-base leading-relaxed mb-4">
                  Enterprises spend billions understanding consumer intent. Datomacy provides real behavioral insights—what people actually want, not what they say they want.
                </p>
                <div className="mt-4 p-4 bg-primary/10 rounded-lg border border-primary/20">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between text-muted-foreground">
                      <span>Global intent data market:</span>
                      <span className="text-foreground font-bold">$247B annually</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Contributors share:</span>
                      <span className="text-primary font-bold">Fair value distribution</span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 sm:py-24 lg:py-32 bg-gradient-to-b from-transparent to-muted/20 relative">
          <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-6 sm:mb-8 text-foreground">
                Start Contributing Your Data
              </h2>
              <p className="text-lg sm:text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto mb-8">
                Join contributors helping build the future of intent data while earning token rewards
              </p>
              <WaitlistForm
                variant="modal"
                triggerText="Get Started Now"
                triggerClassName="text-lg px-12 py-6 font-bold"
              />
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mt-12">
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-black text-foreground mb-2">$247B</div>
                <p className="text-muted-foreground text-sm">Global market size</p>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-black text-foreground mb-2">Real-Time</div>
                <p className="text-muted-foreground text-sm">Data processing</p>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-black text-foreground mb-2">Token</div>
                <p className="text-muted-foreground text-sm">Reward system</p>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-black text-foreground mb-2">1-Click</div>
                <p className="text-muted-foreground text-sm">Setup time</p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 sm:py-12 border-t border-border/10 bg-gradient-to-t from-background to-transparent">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
              <div className="text-center lg:text-left">
                <h3 className="text-2xl sm:text-3xl font-black text-foreground mb-2">Datomacy</h3>
                <p className="text-muted-foreground text-sm sm:text-base">Enterprise Intent Data Platform</p>
                <p className="text-muted-foreground text-xs sm:text-sm">Real-time behavioral intelligence</p>
                <div className="flex items-center justify-center lg:justify-start gap-2 mt-2">
                  <span className="text-muted-foreground text-xs sm:text-sm">Enterprise inquiries:</span>
                  <a href="mailto:deeptanshu@eonxi.com" className="text-primary hover:underline text-xs sm:text-sm">deeptanshu@eonxi.com</a>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 lg:gap-8 items-center">
                <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
                  <Link href="/how-it-works" className="text-muted-foreground hover:text-foreground transition-colors text-sm">How It Works</Link>
                  <Link href="/technology" className="text-muted-foreground hover:text-foreground transition-colors text-sm">Technology</Link>
                  <a href="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm">Privacy Policy</a>
                  <a href="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm">Terms</a>
                </div>

                <div className="flex space-x-3 sm:space-x-4">
                  <a href="https://github.com/datomacy" className="text-muted-foreground hover:text-foreground transition-colors p-2 hover:bg-background/5 rounded-lg">
                    <Github className="w-4 h-4 sm:w-5 sm:h-5" />
                  </a>
                  <a href="https://x.com/datomacy" className="text-muted-foreground hover:text-foreground transition-colors p-2 hover:bg-background/5 rounded-lg">
                    <Twitter className="w-4 h-4 sm:w-5 sm:h-5" />
                  </a>
                  <a href="https://discord.gg/GYqXDuqgp7" className="text-muted-foreground hover:text-foreground transition-colors p-2 hover:bg-background/5 rounded-lg">
                    <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                  </a>
                </div>
              </div>
            </div>

            <Separator className="my-6 sm:my-8 bg-border/20" />

            <div className="text-center text-muted-foreground">
              <p className="text-xs sm:text-sm">&copy; 2025 Datomacy. All rights reserved.</p>
              <p className="mt-2 text-xs sm:text-sm">Powering the next generation of intent data intelligence</p>
            </div>
          </div>
        </footer>
      </div>

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

