/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'radio-images.npo.nl',
      },
      {
        protocol: 'https',
        hostname: 'stem-assets.nporadio.nl',
      },
      {
        protocol: 'https',
        hostname: 'broadcast-images.nporadio.nl',
      }
    ],
  },
}

module.exports = nextConfig
