/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["192.168.0.104", "your-api-domain.com"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: "http",
        hostname: "192.168.0.104",
        port: "1337",
        pathname: "/uploads/**",
      },
    ],
    unoptimized: true,
  },
};

module.exports = nextConfig;
