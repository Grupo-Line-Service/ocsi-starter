import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

const raiz = fileURLToPath(new URL(".", import.meta.url)).replace(/[/\\]$/, "");
const stub = fileURLToPath(new URL("./tests/stubs/vazio.ts", import.meta.url));

export default defineConfig({
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts"],
  },
  resolve: {
    alias: {
      // `@/lib/foo` → `<raiz>/lib/foo` (mesmo mapeamento do tsconfig).
      "@": raiz,
      // Neutraliza as fronteiras server/client nos testes.
      "server-only": stub,
      "client-only": stub,
    },
  },
});
