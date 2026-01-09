/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Skip ESLint during production builds (Vercel/next build)
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Allow production builds even if TypeScript reports errors
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
