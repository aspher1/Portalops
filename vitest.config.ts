import { defineConfig } from "vitest/config";

export default defineConfig({
  test: { environment: "node", coverage: { reporter: ["text", "json"] } },
  resolve: { alias: { "@": import.meta.dirname } },
});
