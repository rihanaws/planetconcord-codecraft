import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['@prisma/client', '@prisma/adapter-mariadb', 'mariadb'],
  images: {
    remotePatterns: [
      { hostname: 'img.youtube.com' },
    ],
  },
};

export default nextConfig;
