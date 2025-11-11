import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  // Force cache busting on each build to prevent stale JavaScript
  generateBuildId: async () => {
    return `build-${Date.now()}`;
  },
  // Production builds will now fail if there are TypeScript or ESLint errors
  // This ensures code quality and prevents broken code from reaching production
  eslint: {
    ignoreDuringBuilds: false,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  // Output configuration for Vercel deployment
  output: 'standalone',
  // Experimental features
  experimental: {
    // Enable server actions
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
};

export default nextConfig;
