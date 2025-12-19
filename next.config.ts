import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    // fallback สำหรับ fs (ฝั่ง client)
    config.resolve = {
      ...config.resolve,
      fallback: {
        ...(config.resolve?.fallback || {}),
        fs: false,
      },
    };

    // รองรับ __dirname
    config.node = {
      __dirname: true,
    };

    // กันไม่ให้ pdfmake ถูก bundle ฝั่ง server
    if (isServer) {
      config.externals = [
        ...(Array.isArray(config.externals) ? config.externals : []),
        "pdfmake",
      ];
    }

    // บังคับ alias ให้ fontkit ชี้ path จริง
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      "@foliojs-fork/fontkit": path.resolve(
        __dirname,
        "node_modules/@foliojs-fork/fontkit"
      ),
    };

    return config;
  },

  turbopack: {
    resolveExtensions: [".mdx", ".tsx", ".jsx", ".js", ".mjs", ".json"],
    rules: {
      "*.svg": {
        loaders: ["@svgr/webpack"],
        as: "*.js",
      },
    },
  },

  experimental: {},

  // สำหรับ server-only packages
  serverExternalPackages: ["pdfkit"],

  typedRoutes: true,
};

export default nextConfig;
