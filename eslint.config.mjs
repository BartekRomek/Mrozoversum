import { defineConfig, globalIgnores } from "eslint/config";
import { FlatCompat } from "@eslint/eslintrc";

const compat = new FlatCompat({ baseDirectory: import.meta.dirname });

export default defineConfig([
  ...compat.extends("next/core-web-vitals"),
  {
    rules: {
      // Static export intentionally uses a custom assetPath loader and <img>.
      "@next/next/no-img-element": "off",
      "@next/next/no-html-link-for-pages": "off",
      "react-hooks/exhaustive-deps": "off"
    }
  },
  globalIgnores([".next/**", "out/**", "node_modules/**"])
]);
