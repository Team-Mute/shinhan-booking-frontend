const path = require("path");

const nextConfig = {
  compiler: {
    emotion: true,
  },
  transpilePackages: ["@components", "@styles"],
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
};

module.exports = nextConfig;
