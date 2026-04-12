import nextVitals from "eslint-config-next/core-web-vitals";

/** @type {import('eslint').Linter.Config[]} */
const config = [
  ...nextVitals,
  {
    ignores: [".next/**", "node_modules/**", "public/uploads/**"],
    rules: {
      "react/jsx-no-comment-textnodes": "off",
      "react/no-unescaped-entities": "off",
    },
  },
];

export default config;
