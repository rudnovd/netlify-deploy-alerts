module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
  },
  extends: [
    '@nuxtjs/eslint-config-typescript',
    'plugin:vue/base',
    'plugin:vue/vue3-essential',
    'plugin:vue/vue3-strongly-recommended',
    'plugin:vue/vue3-recommended',
    'plugin:prettier/recommended',
  ],
  plugins: [],
  rules: {
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'vue/block-tag-newline': [
      'error',
      {
        singleline: 'always',
        multiline: 'always',
      },
    ],
    'vue/custom-event-name-casing': ['error', 'kebab-case'],
    'vue/component-name-in-template-casing': ['error', 'kebab-case'],
    'vue/html-comment-content-spacing': [process.env.NODE_ENV === 'production' ? 'error' : 'warn', 'always'],
    'vue/no-reserved-component-names': [
      'error',
      {
        disallowVueBuiltInComponents: true,
        disallowVue3BuiltInComponents: true,
      },
    ],
    'vue/padding-line-between-blocks': [process.env.NODE_ENV === 'production' ? 'error' : 'warn', 'always'],
    'vue/v-on-function-call': [
      'error',
      'never',
      {
        ignoreIncludesComment: false,
      },
    ],
    'vue/arrow-spacing': ['error'],
    'vue/multi-word-component-names': ['off'],
    semi: 'off',
  },
}
