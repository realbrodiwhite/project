/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    USE_FINAL_DASHBOARD: process.env.USE_FINAL_DASHBOARD,
  },
}

module.exports = nextConfig
