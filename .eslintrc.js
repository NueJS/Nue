module.exports = {
  env: {
    browser: true,
    es2021: true,
    jest: true
  },
  extends: [
    'standard'
  ],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module'
  },
  rules: {
    'brace-style': 'off',
    camelcase: 'off'
  }
  // globals: {
  //   supersweet: 'readonly'
  // }
}
