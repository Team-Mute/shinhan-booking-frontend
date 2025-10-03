// next.config.js
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const nextConfig = {
  transpilePackages: ["@components", "@styles"], // 여기에 패키지 이름을 추가합니다.
};

export default nextConfig;
