/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  trailingSlash: true, // For GitHub Pages compatibility
  // Add this to ensure static paths are generated correctly
  experimental: {
    appDir: true
  }
};

module.exports = nextConfig;