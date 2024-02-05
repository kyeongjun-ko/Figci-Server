module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
  },
  extends: ["airbnb", "airbnb/hooks", "plugin:prettier/recommended"],
  overrides: [
    {
      env: {
        node: true,
      },
      files: [".eslintrc.{js,cjs}", "bin/www"],
      parserOptions: {
        sourceType: "script",
      },
    },
  ],
  parserOptions: {
    ecmaVersion: "latest",
  },
  plugins: ["prettier"],
  rules: {
    semi: "warn",
    "no-unused-vars": "warn",
    "no-param-reassign": 0,
    "no-restricted-syntax": ["error", "LabeledStatement", "WithStatement"],
    "array-callback-return": "off",
    "consistent-return": "off",
  },
};
