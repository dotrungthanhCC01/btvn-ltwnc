import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx"],
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/test/setup.ts",
    coverage: {
      provider: "v8",
      reporter: ["text"],
      include: [
        "src/features/cart/**",
        "src/features/products/**",
        "src/app/**",
      ],
      exclude: [
        "src/features/cart/cartType.ts",
        "src/features/products/productType.ts",
        "src/**/*.test.*",
        "src/test/**",
      ],
      thresholds: {
        statements: 70,
        branches: 70,
        functions: 70,
        lines: 70,
      },
    },
  },
});

