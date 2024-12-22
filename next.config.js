/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: '/SantaHat',
  assetPrefix: '/SantaHat/',
}

module.exports = nextConfig

