import { defineConfig } from "tsdown";

export default defineConfig({
  entry: "src/result.ts",
  outDir: "dist",
  format: "esm",
  sourcemap: true,
  clean: true,
  dts: true,
});
