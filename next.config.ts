import type { NextConfig } from "next";

function buildApiImagePattern() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL?.trim();
  if (!apiUrl) {
    return [];
  }
  try {
    const parsed = new URL(apiUrl);
    const protocol = parsed.protocol.replace(":", "");
    if (protocol !== "http" && protocol !== "https") {
      return [];
    }
    return [
      {
        protocol: protocol as "http" | "https",
        hostname: parsed.hostname,
        ...(parsed.port ? { port: parsed.port } : {}),
      },
    ];
  } catch {
    return [];
  }
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      ...buildApiImagePattern(),
    ],
  },
};

export default nextConfig;
