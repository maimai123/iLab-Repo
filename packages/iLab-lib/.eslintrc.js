module.exports = {
  extends: [require.resolve('eslint-config-ali/typescript/react')],
  rules: {
    'import/no-cycle': 0,
    'react/prop-types': 0,
    'generator-star-spacing': 0,
    // 'simple-import-sort/imports': [
    //   'error',
    //   {
    //     groups: [['^@?\\w'], ['^'], ['^\\.'], ['^.+\\u0000$'], ['^\\u0000']],
    //   },
    // ],
    // 'simple-import-sort/exports': 'error',
  },
};
