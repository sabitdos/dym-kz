/* Auto-generated initial ESLint config */
module.exports = {
  root: true,
  env: { browser: true, es2022: true, node: true },
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'plugin:tailwindcss/recommended',
    'prettier'
  ],
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
    ecmaVersion: 'latest',
    sourceType: 'module',
    extraFileExtensions: ['.vue']
  },
  plugins: [
    'vue',
    '@typescript-eslint',
    'import',
    'unused-imports',
    'tailwindcss'
  ],
  settings: {
    'import/resolver': {
      typescript: { project: './tsconfig.json' },
      node: { extensions: ['.js', '.jsx', '.mjs', '.ts', '.tsx', '.d.ts', '.vue'] }
    }
  },
  rules: {
    'vue/multi-word-component-names': 'off',
    'import/order': ['warn', {
      'groups': ['builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'object', 'type'],
      'newlines-between': 'always',
      'alphabetize': { 'order': 'asc', 'caseInsensitive': true }
    }],
    '@typescript-eslint/no-explicit-any': 'warn',
    'unused-imports/no-unused-imports': 'warn',
    'no-console': ['warn', { allow: ['error', 'warn'] }],
    'vue/script-setup-uses-vars': 'error'
  }
}
