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
        "node_modules/@foliojs-fork/fontkit",
      ),
    };

    // Ignore source maps for html5-qrcode library (prevents 404 errors)
    config.module = {
      ...config.module,
      rules: [
        ...(config.module?.rules || []),
        {
          test: /node_modules[\\/]html5-qrcode/,
          enforce: "pre" as const,
          use: ["source-map-loader"],
          // Suppress warnings for missing source maps
          resolve: {
            fullySpecified: false,
          },
        },
      ],
    };

    // Ignore warnings about missing source maps from html5-qrcode
    config.ignoreWarnings = [
      ...(config.ignoreWarnings || []),
      /Failed to parse source map/,
      /html5-qrcode/,
    ];

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

  // Disable source maps in production to prevent 404 errors from libraries like html5-qrcode
  productionBrowserSourceMaps: false,

  // สำหรับ server-only packages
  serverExternalPackages: ["pdfkit"],

  typedRoutes: true,
  eslint: { ignoreDuringBuilds: true },
};

export default nextConfig;
