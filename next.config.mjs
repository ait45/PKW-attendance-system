/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
    };
    config.node = {
      __dirname: true,
    };
    if (isServer) {
      config.externals = [...(config.externals || []), "pdfmake"];
    }
    // 🔧 บังคับให้ Next รู้ตำแหน่งที่แท้จริงของ fontkit
    config.resolve.alias["@foliojs-fork/fontkit"] = path.resolve(
      __dirname,
      "node_modules/@foliojs-fork/fontkit"
    );
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
  serverExternalPackages: ["pdfkit"],
};

export default nextConfig;
