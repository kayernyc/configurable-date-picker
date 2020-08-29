/**
👋 Hi! This file was autogenerated by tslint-to-eslint-config.
https://github.com/typescript-eslint/tslint-to-eslint-config

It represents the closest reasonable ESLint configuration to this
project's original TSLint configuration.

We recommend eventually switching this configuration to extend from
the recommended rulesets in typescript-eslint.
https://github.com/typescript-eslint/tslint-to-eslint-config/blob/master/docs/FAQs.md

Happy linting! 💖
*/
module.exports = {
  root: true,
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "plugin:import/errors",
    "plugin:import/warnings",
    "prettier",
    "plugin:unicorn/recommended",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: `./tsconfig.eslint.json`,
    createDefaultProgram: true,
  },
  plugins: ["@typescript-eslint", "jsdoc", "import", "prefer-arrow", "unicorn"],
  parserOptions: {
    project: "./tsconfig.json",
    createDefaultProgram: true,
  },
  settings: {
    "import/resolver": {
      node: {
        extensions: [".js", ".jsx", ".ts", ".tsx"],
        paths: ["./src"],
      },
    },
  },
  rules: {
    "unicorn/filename-case": [
      "warn",
      {
        cases: {
          camelCase: true,
          pascalCase: true,
        },
      },
    ],
  },
  ignorePatterns: ["*.spec.ts", "webpack.config.js"],
};
