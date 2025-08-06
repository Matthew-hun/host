/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  // basePath és assetPrefix NEM KELL root domainhez!
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
