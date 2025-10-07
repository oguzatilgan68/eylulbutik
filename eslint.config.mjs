import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
  },
  ...compat.config({
    extends: ["next"],
    rules: {
      "react/no-unescaped-entities": "off",
      "@next/next/no-img-element": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/ban-types": "off",
      "no-unused-vars": "off",
      "no-console": "off",
      "react-hooks/exhaustive-deps": "off",
    },
  }),
];

export default eslintConfig;
