import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: true,
  // Деплой на сервер: самодостаточная сборка без node_modules
  output: "standalone",
};

export default nextConfig;
