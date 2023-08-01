module.exports = {
  extends: 'airbnb-base',
  env: {
    browser: true,
    es2021: true,
    mocha: true
  },
  plugins: [
    'chai-expect',
    'chai-friendly',
    'mocha-no-only'
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  globals: {
    expect: 'readonly',
    testHelper: 'readonly',
    apiTestHelper: 'readonly',
    databaseTestHelper: 'readonly'
  },
  rules: {
    'max-classes-per-file': 'off',
    'arrow-body-style': 'off',
    'no-shadow': 'off',
    'class-methods-use-this': 'off',
    'prefer-rest-params': 'off',
    'no-underscore-dangle': 'off',
    'func-names': ['error', 'never'],
    'import/prefer-default-export': 'off',
    'no-unused-expressions': 0,
    'chai-friendly-/no-unused-expressions': 0,
    'max-len': ['error', { code: 100 }],
    'arrow-parens': 0,
    'mocha-no-only/mocha-no-only': ['error'],
    'no-global-assign': [
      'error',
      {
        exceptions: ['expect', 'testHelper', 'apiTestHelper', 'databaseTestHelper']
      }
    ],
    'comma-dangle': [
      'error',
      {
        arrays: 'never',
        objects: 'never',
        imports: 'never',
        exports: 'never',
        functions: 'never'
      }
    ],
    'class-method-use-this': 'off',
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        json: 'never',
        js: 'never'
      }
    ]
  }
};
