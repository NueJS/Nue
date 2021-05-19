module.exports = {
  env: {
    browser: true,
    es2021: true,
    jest: true
  },
  extends: [
    'standard'
  ],
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module'
  },
  rules: {
    'brace-style': 'off',
    'no-throw-literal': 'off',
    'spaced-comment': 'off',
    'symbol-description': 'off',
    'padded-blocks': 'off',
    camelcase: 'off'
  },
  globals: {
    _DEV_: 'readonly'
  }
}
