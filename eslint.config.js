import eslint from '@antfu/eslint-config'

// Run `npx eslint-flat-config-viewer@latest` to view all rules.
export default eslint({
  rules: {
    'style/brace-style': ['error', '1tbs', {
      allowSingleLine: false,
    }],
    'curly': ['error', 'all'],
    'style/arrow-parens': ['error', 'as-needed', {
      requireForBlockBody: false,
    }],
    'antfu/top-level-function': 'off',
    'style/multiline-ternary': 'off',
  },
})
