/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    // Fix for firebase/auth in Next.js
    config.externals = [...(config.externals || []), { encoding: "encoding" }];
    return config;
  },
};

module.exports = nextConfig
