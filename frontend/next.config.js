/** @type {import('next').NextConfig} */
const path = require('path')

const nextConfig = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: false,
  },
  transpilePackages: ['@career-reality-checker/engine'],
  webpack: (config, { isServer }) => {
    if (isServer) {
      // For server-side, resolve workspace package
      config.resolve.alias = {
        ...config.resolve.alias,
        '@career-reality-checker/engine': path.resolve(__dirname, '../../engine/dist'),
      }
    }
    return config
  },
}

module.exports = nextConfig

