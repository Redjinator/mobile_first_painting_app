import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow local network access for mobile testing
  allowedDevOrigins: [
    'http://10.0.0.145:3005',
    'http://localhost:3005',
  ],
};

export default nextConfig;
