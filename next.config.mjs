/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
    };
    config.node = {
      __dirname: true,
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
  experimental: {
    serverExternalPackages: ["pdfkit"],
  },
};

export default nextConfig;
