/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  trailingSlash: true, // For GitHub Pages compatibility
  // For username.github.io repos, we don't need basePath or assetPrefix
};

module.exports = nextConfig;