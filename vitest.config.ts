import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    coverage: {
      enabled: true,
      reporter: ["text", "json", "html"],
    },
    include: ["src/**/*.test.ts"],
    ui: true,
  },
  root: ".",
});
