/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static optimization where possible
  output: 'standalone',
  
  // Image optimization
  images: {
    unoptimized: true,
  },
  
  // Server Actions are enabled by default in Next.js 14
  // No experimental flags needed
  
  // Disable type checking during build (we already do this separately)
  typescript: {
    ignoreBuildErrors: false,
  },
  
  // ESLint configuration
  eslint: {
    ignoreDuringBuilds: false,
  },
};

module.exports = nextConfig;
