import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // O núcleo compartilhado é distribuído como FONTE .ts/.tsx (sem build step,
  // para editar o pacote ser tão simples quanto editar o app). Sem isto o Next
  // não transpila o que vem de node_modules e o import quebra no build.
  transpilePackages: ["@ocsi/ui"],
};

export default nextConfig;
