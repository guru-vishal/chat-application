module.exports = {
  root: true,
  parser: '@babel/eslint-parser',
  extends: ['@react-native'],
  parserOptions: {
    requireConfigFile: true,
    ecmaFeatures: {
      jsx: true,
    },
  },
  env: {
    browser: true,
    node: true,
    es2021: true,
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};
