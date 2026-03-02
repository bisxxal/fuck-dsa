import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Required for Electron production (static export)
  output: process.env.ELECTRON_BUILD === 'true' ? 'export' : undefined,
  // Disable image optimization for static export in Electron
  images: {
    unoptimized: process.env.ELECTRON_BUILD === 'true',
  },
  // Ensure assets use relative paths for Electron file:// protocol
  assetPrefix: process.env.ELECTRON_BUILD === 'true' ? '.' : undefined,
};

export default nextConfig;
