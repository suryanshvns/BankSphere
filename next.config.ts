import type { NextConfig } from "next";
import { resolvePublicApiBaseUrl } from "./src/services/public-api-base";

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_API_BASE_URL: resolvePublicApiBaseUrl(
      process.env.NEXT_PUBLIC_API_BASE_URL
    ),
  },
};

export default nextConfig;
