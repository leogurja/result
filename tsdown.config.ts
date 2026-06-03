import { defineConfig } from "tsdown";

export default defineConfig({
  entry: "src/result.ts",
  outDir: "dist",
  sourcemap: true,
  clean: true,
  dts: true,
  exports: true,
  platform: "neutral",
  target: "es2022",
});
