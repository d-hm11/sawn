import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // تعطيل فحص lock للسماح بتشغيل متعدد
  },
};

export default nextConfig;
