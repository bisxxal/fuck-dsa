import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    typescript: {
    ignoreBuildErrors: true,
  },
   
  // Required for Electron production (static export)
  output: process.env.ELECTRON_BUILD === 'true' ? 'export' : undefined,
  // Disable image optimization for static export in Electron
  images: { 
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "ik.imagekit.io",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol:"https",
        hostname:"randomuser.me"
      }
    ],
  }, 
    // unoptimized: process.env.ELECTRON_BUILD === 'true',
  // },
  // Ensure assets use relative paths for Electron file:// protocol
  assetPrefix: process.env.ELECTRON_BUILD === 'true' ? '.' : undefined,
};

export default nextConfig;
