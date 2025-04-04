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
    rules: {
      // Отключаем правило проверки any
      "@typescript-eslint/no-explicit-any": "off",

      // При желании можно отключить и другие раздражающие правила
      "@typescript-eslint/no-unused-vars": "warn", // Предупреждение вместо ошибки
      "no-console": "off", // Разрешаем использование console.log
    },
  },
];

export default eslintConfig;
