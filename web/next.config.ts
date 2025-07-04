import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    // Fix for wallet connection issues
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }

    // Optimize for pino warnings
    config.resolve.alias = {
      ...config.resolve.alias,
      'pino-pretty': false,
    };

    return config;
  },
  
  // Suppress hydration warnings for wallet components
  reactStrictMode: true,
  
  // External packages that should not be bundled
  serverExternalPackages: ['pino', 'pino-pretty'],
};

export default nextConfig;
