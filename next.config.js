/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.resolve.fallback = { fs: false, net: false, tls: false };
    const rules = config.module.rules;

    const babelLoader = rules.find(
      (rule) => rule.use && rule.use.loader === "babel-loader"
    );

    if (babelLoader) {
      // Modify test to include cjs for @chainsafe/libp2p-gossipsub rpc module
      if (babelLoader.test.toString().includes("mjs")) {
        if (babelLoader.test.toString().includes("jsx")) {
          babelLoader.test = /\.(js|cjs|mjs|jsx|ts|tsx)$/;
        } else {
          babelLoader.test = /\.(js|cjs|mjs|ts)$/;
        }
      }
    }
    return config;
  },
  transpilePackages: ["@lens-protocol"],
};

module.exports = nextConfig;
