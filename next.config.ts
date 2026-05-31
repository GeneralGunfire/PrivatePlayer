import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "i.pinimg.com" },
      { protocol: "https", hostname: "lastfm.freetls.fastly.net" },
    ],
  },

  // Cache headers for static music files and images
  async headers() {
    return [
      {
        // MP3 files — cache aggressively, they never change
        source: "/music/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
          { key: "Accept-Ranges", value: "bytes" },
        ],
      },
      {
        // API routes — short cache so playlist changes propagate
        source: "/api/playlists/:path*",
        headers: [
          { key: "Cache-Control", value: "no-store" },
        ],
      },
      {
        // Music file list — can be cached longer since it rarely changes
        source: "/api/music-files",
        headers: [
          { key: "Cache-Control", value: "public, max-age=3600, stale-while-revalidate=86400" },
        ],
      },
    ];
  },
};

export default nextConfig;
