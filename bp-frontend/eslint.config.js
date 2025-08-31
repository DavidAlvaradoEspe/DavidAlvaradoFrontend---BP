const eslint = require("@eslint/js");
const tslint = require("typescript-eslint");
const angular = require("angular-eslint");

module.exports = tslint.config(
  {
    ignores: [
      'dist/**',
      '.angular/**',
      'coverage/**',
      'jest-coverage/**',
      'jest-cache/**'
    ],
    files: ["**/*.ts"],
    extends: [
      eslint.configs.recommended,
      ...tslint.configs.recommendedTypeChecked,
      ...tslint.configs.strictTypeChecked,
      ...angular.configs.tsRecommended,
    ],
    languageOptions: {
      parserOptions: {
        project: [
          './tsconfig.json',
          './tsconfig.app.json',
          './tsconfig.spec.json',
        ],
        tsconfigRootDir: __dirname,
        ecmaVersion: 'latest',
        sourceType: 'module',
      }
    },
    processor: angular.processInlineTemplates,
    rules: {
      "@angular-eslint/directive-selector": [
        "error",
        {
          type: "attribute",
          prefix: "app",
          style: "camelCase",
        },
      ],
      "@angular-eslint/component-selector": [
        "error",
        {
          type: "element",
          prefix: "app",
          style: "kebab-case",
        },
      ],
      "@typescript-eslint/consistent-type-imports": [
        "error",
        {
          prefer: "type-imports",
        },
      ],
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
      "no-console": [
        "warn",
        {
          allow: ["warn", "error"],
        },
      ],
      "eqeqeq": [
        "error",
        "smart"
      ],
      "curly": [
        "error",
        "all"
      ],
    },
  },
  {
    files: ["**/*.html"],
    extends: [
      ...angular.configs.templateRecommended,
      ...angular.configs.templateAccessibility,
    ],
    rules: {
      '@angular-eslint/template/eqeqeq':'error',
      '@angular-eslint/template/banana-in-box':'error',
      '@angular-eslint/template/no-negated-async':'error',
    },
  },
  {
    files: ["**/*.spec.ts"],
    rules: {
      'no-console':'off',
      '@typescript-eslint/no-explicit-any':'off',
  },
  }
);
