/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  trailingSlash: true, // For GitHub Pages compatibility
  // Remove appDir flag as it's now stable and enabled by default
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '', // For GitHub Pages subdirectory support
};

module.exports = nextConfig;