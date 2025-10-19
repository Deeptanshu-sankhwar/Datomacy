"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Layout from '@/components/Layout';
import Link from 'next/link';
import { 
  Calendar,
  Clock,
  User,
  ArrowLeft,
} from "lucide-react";

export default function BlogPostPage() {
  const blogPost = {
    title: "Why We're Not Killing YouTube Data—We're Expanding Beyond It to Capture the Entire Web",
    subtitle: "What if I told you that YouTube data is incredibly valuable—but it's only 8% of the complete consumer behavior picture?",
    author: "Datomacy Research Team",
    date: "October 19, 2025",
    readTime: "12 min read",
    category: "Strategic Vision",
    tags: ["YouTube Data", "Universal Web", "Enterprise Intelligence", "Consumer Behavior"],
    content: [
      {
        type: "paragraph",
        text: "We live in a day and age where consumer behavior spans dozens of platforms before purchase decisions are made. At Datomacy, we've built the most sophisticated YouTube intent data platform in the creator economy. Our YouTube analytics have helped thousands of creators optimize content and advertisers target audiences with surgical precision."
      },
      {
        type: "paragraph",
        text: "But here's what we discovered: YouTube data is the perfect gateway to understanding complete consumer intent."
      },
      {
        type: "heading",
        text: "The Strategic Expansion That Changes Everything"
      },
      {
        type: "paragraph",
        text: "Our YouTube data platform isn't going anywhere—it's evolving into something much more powerful. We're expanding from YouTube-specific insights to universal web intent intelligence that captures the complete consumer journey across every digital touchpoint."
      },
      {
        type: "paragraph",
        text: "Here's why this isn't just growth—it's a complete market transformation."
      },
      {
        type: "heading",
        text: "YouTube Data: The Creator Economy's Secret Weapon"
      },
      {
        type: "paragraph",
        text: "Let's be clear: YouTube behavioral data remains incredibly valuable for specific use cases:"
      },
      {
        type: "list",
        items: [
          "Content creators optimizing for engagement and monetization",
          "YouTube advertisers targeting audiences with platform-specific precision",
          "Influencer marketing agencies measuring authentic engagement patterns",
          "Creator economy tools building YouTube-native solutions"
        ]
      },
      {
        type: "paragraph",
        text: "Our YouTube platform continues serving these markets because the data requirements are fundamentally different from enterprise intelligence needs."
      },
      {
        type: "heading",
        text: "But YouTube Is Just the Beginning"
      },
      {
        type: "paragraph",
        text: "Here's what we learned after analyzing millions of consumer journeys: YouTube engagement is often the starting point of purchase decisions, not the ending point."
      },
      {
        type: "paragraph",
        text: "A consumer watches a productivity app review on YouTube, then:"
      },
      {
        type: "list",
        items: [
          "Researches alternatives on Google",
          "Reads reviews on G2 and Capterra",
          "Compares pricing across vendor websites",
          "Checks Reddit discussions for honest opinions",
          "Reads industry analyst reports",
          "Finally makes a purchase decision"
        ]
      },
      {
        type: "callout",
        text: "YouTube data shows you the spark. Universal web data shows you the entire fire."
      },
      {
        type: "heading",
        text: "The Enterprise Opportunity That Changes Markets"
      },
      {
        type: "paragraph",
        text: "While creators need YouTube-specific insights, enterprise clients need something completely different: complete consumer behavior intelligence across all digital touchpoints."
      },
      {
        type: "paragraph",
        text: "Top advertising firms want to understand how their campaigns influence behavior across the entire web—not just individual platforms."
      },
      {
        type: "paragraph",
        text: "Hedge funds and asset management firms need real-time market intelligence that predicts consumer spending patterns, competitive dynamics, and industry shifts based on actual behavioral data."
      },
      {
        type: "paragraph",
        text: "E-commerce companies require cross-platform attribution that shows how consumers research, evaluate, and decide across dozens of touchpoints before purchasing."
      },
      {
        type: "heading",
        text: "The Universal Data Advantage"
      },
      {
        type: "paragraph",
        text: "Our universal web approach provides intelligence that no single-platform solution can match:"
      },
      {
        type: "list",
        items: [
          "Complete Customer Journey Mapping: See every digital touchpoint from initial awareness through purchase",
          "Cross-Platform Attribution: Understand how YouTube engagement influences website conversions",
          "Real-Time Market Intelligence: Track consumer sentiment and competitive dynamics across all platforms",
          "Predictive Purchase Modeling: Identify buying intent weeks before traditional signals appear"
        ]
      },
      {
        type: "heading",
        text: "Why This Strategy Is Brilliant"
      },
      {
        type: "paragraph",
        text: "Most companies choose between depth and breadth. We're choosing both:"
      },
      {
        type: "list",
        items: [
          "Deep YouTube expertise for creator economy clients who need platform-specific optimization",
          "Universal web intelligence for enterprise clients who need complete behavioral visibility"
        ]
      },
      {
        type: "heading",
        text: "The Chrome Extension Breakthrough"
      },
      {
        type: "paragraph",
        text: "Browser extensions see everything that happens across the web—including how YouTube content influences behavior on other platforms. This gives us unique advantages:"
      },
      {
        type: "list",
        items: [
          "Complete attribution models showing YouTube's role in complex purchase journeys",
          "Cross-platform behavioral patterns that single-platform tools miss completely",
          "Real-time intent detection across all digital touchpoints",
          "Competitive intelligence spanning entire industries, not just individual platforms"
        ]
      },
      {
        type: "heading",
        text: "Market Segmentation That Actually Makes Sense"
      },
      {
        type: "paragraph",
        text: "Creator Economy Clients get YouTube-specific tools:"
      },
      {
        type: "list",
        items: [
          "Content optimization based on engagement patterns",
          "Audience insights for better targeting",
          "Monetization strategies using platform-specific data",
          "YouTube advertising intelligence"
        ]
      },
      {
        type: "paragraph",
        text: "Enterprise Clients get universal web intelligence:"
      },
      {
        type: "list",
        items: [
          "Complete consumer journey mapping",
          "Cross-platform behavioral analytics",
          "Real-time market and competitive intelligence",
          "Predictive purchase modeling"
        ]
      },
      {
        type: "heading",
        text: "Questions Every Business Leader Should Consider:"
      },
      {
        type: "list",
        items: [
          "Are you making decisions based on single-platform data when your customers use dozens of platforms?",
          "What's the revenue impact of understanding your customers' complete digital behavior?",
          "How much more effective would your strategies be with universal web intelligence instead of platform-specific insights?"
        ]
      },
      {
        type: "heading",
        text: "The Future Is Multi-Platform Intelligence"
      },
      {
        type: "paragraph",
        text: "YouTube data remains incredibly valuable for its specific use cases. But the future belongs to companies that understand consumer behavior across the entire web—not just individual platforms."
      },
      {
        type: "paragraph",
        text: "Datomacy—where data meets diplomacy—isn't abandoning YouTube data. We're expanding beyond it to capture the complete picture of consumer intent across every digital touchpoint. Our approach combines the precision of data science with the strategic finesse of diplomatic intelligence gathering."
      },
      {
        type: "callout",
        text: "The question isn't whether you need platform-specific or universal intelligence. The question is whether you need both."
      }
    ]
  };

  return (
    <Layout>
      <div className="min-h-screen bg-background text-foreground">
        {/* Back Button */}
        <section className="pt-24 pb-6 sm:pt-28 sm:pb-8">
          <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
            <Link href="/blog">
              <Button
                variant="ghost"
                className="text-muted-foreground hover:text-foreground mb-4"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Blog
              </Button>
            </Link>
          </div>
        </section>

        {/* Article */}
        <article className="pb-16 sm:pb-24">
          <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
            {/* Header */}
            <header className="mb-12">
              <Badge className="bg-primary/10 text-primary border-primary/30 px-3 py-1 text-xs font-bold mb-4">
                {blogPost.category}
              </Badge>
              
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-foreground mb-6 leading-tight">
                {blogPost.title}
              </h1>
              
              <p className="text-lg sm:text-xl text-primary font-semibold mb-8 leading-relaxed italic border-l-4 border-primary pl-4">
                {blogPost.subtitle}
              </p>

              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>{blogPost.author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{blogPost.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{blogPost.readTime}</span>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {blogPost.tags.map((tag, index) => (
                  <Badge 
                    key={index}
                    className="bg-primary/10 text-primary border-primary/30 hover:bg-primary/20 transition-colors text-xs"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </header>

            {/* Content */}
            <div className="prose prose-lg max-w-none">
              {blogPost.content.map((block, index) => {
                if (block.type === 'heading') {
                  return (
                    <h2 key={index} className="text-2xl sm:text-3xl font-bold text-foreground mt-12 mb-6 first:mt-0">
                      {block.text}
                    </h2>
                  );
                }
                
                if (block.type === 'paragraph') {
                  return (
                    <p key={index} className="text-base sm:text-lg text-muted-foreground mb-6 leading-relaxed">
                      {block.text}
                    </p>
                  );
                }
                
                if (block.type === 'list') {
                  return (
                    <ul key={index} className="list-none space-y-3 mb-8 ml-0">
                      {block.items?.map((item, itemIndex) => (
                        <li key={itemIndex} className="text-base sm:text-lg text-muted-foreground flex items-center gap-3">
                          <span className="text-primary flex-shrink-0 text-xl leading-none">▸</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  );
                }
                
                if (block.type === 'callout') {
                  return (
                    <div key={index} className="bg-gradient-to-r from-primary/10 to-accent/10 border-l-4 border-primary rounded-r-xl p-8 my-12">
                      <p className="text-lg sm:text-xl font-bold text-foreground leading-relaxed">
                        {block.text}
                      </p>
                    </div>
                  );
                }
                
                return null;
              })}
            </div>

            {/* CTA Section */}
            <div className="mt-16 pt-12 border-t border-border">
              <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl p-8 text-center">
                <h3 className="text-2xl sm:text-3xl font-black text-foreground mb-4">
                  Ready to Get Started?
                </h3>
                <p className="text-base sm:text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
                  Join contributors earning token rewards from their browsing data.
                </p>
                <Link href="/join-waitlist">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-primary to-accent hover:from-primary/80 hover:to-accent/80 text-white font-bold shadow-xl hover:shadow-primary/50 transform hover:scale-105 transition-all duration-300"
                  >
                    Start Contributing
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </article>
      </div>
    </Layout>
  );
}

