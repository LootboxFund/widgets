module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
    ecmaFeatures: {
      modules: true,
      experimentalObjectRestSpread: true,
      ecmaFeatures: {
        // Allows for the parsing of JSX
        jsx: true,
        tsx: true,
      },
    },
  },
  plugins: ['@typescript-eslint', 'simple-import-sort', 'unused-imports', 'prettier'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'prettier',
    'plugin:prettier/recommended',
  ],
  rules: {
    'comma-dangle': 0,
    'no-unused-vars': 'off',
    'no-unexpected-multiline': 'off',
    'prefer-const': 'off',
    'object-shorthand': ['error', 'always'],
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    "@typescript-eslint/no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars-experimental": "off",
    quotes: [2, 'single', { avoidEscape: true, allowTemplateLiterals: true }],
    semi: [2, 'never'],
  },
  settings: {},
  env: {
    browser: true,
    node: true,
    jasmine: true,
    jest: true,
    es6: true,
  },
}
