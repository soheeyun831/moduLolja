module.exports = {
  root: true,
  env: {
    // 코드가 실행되는 환경 설정
    browser: true, // 브라우저 환경에서 실행
    node: true, // 노드 환경에서 실행
  },
  globals: {
    window: true,
    document: true,
  },
  parserOptions: {
    parser: '@typescript-eslint/parser', // TypeScript 코드를 파싱하는 데 사용할 파서 지정
    sourceType: 'module', // ECMAScript 모듈 형식으로 코드 작성
  },
  // 사용할 ESLint 플러그인 목록 - Typescript
  plugins: ['@typescript-eslint', 'vue'],
  extends: [
    'airbnb-base', // airbnb에서 사용하는 JavaScript 스타일 가이드
    'plugin:vue/vue3-essential',
    'eslint:recommended',
  ],
  rules: {
    'import/extensions': 'off', // 파일 확장자를 명시적으로 지정하지 않아도 되도록 함
    'import/no-unresolved': 'off', // 해결할 수 없는 import 경로에 대한 경고 무시
    'import/no-extraneous-dependencies': 'off', // package.json에 없는 패키지를 import할 때 에러 무시
    'import/prefer-default-export': 'off', // 단일 export가 아니어도 되도록 함
    'no-undef': 'error',
    'no-console': 0,
    'no-alert': 0,
    'vue/multi-word-component-names': 'off',
    'no-unused-vars': 'off',
    'no-param-reassign': 0,
    'no-shadow': 0, // 변수명 중복 사용을 허용
    'max-len': 0,
    'no-underscore-dangle': 0,
    'no-restricted-syntax': 0,
    'no-await-in-loop': 0,
    'vue/max-attributes-per-line': 0,
    'vue/html-indent': 0,
    'vue/script-setup-uses-vars': 0,
    'vue/no-unused-components': 1,
    'global-require': 0, // require로 이미지 경로를 지정할 때 발생하는 에러 무시
  },
};
