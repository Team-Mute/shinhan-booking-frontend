// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   compiler: {
//     emotion: true,
//   },
// };

// export default nextConfig;

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
