module.exports = {
  env: {
    node: true,
    es2021: true,
  },
  extends: [
    'airbnb-base', // Airbnb 스타일 가이드
    'plugin:prettier/recommended', // Prettier와 통합
  ],
  plugins: ['prettier'], // Prettier 플러그인
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  rules: {
    'prettier/prettier': 'error', // Prettier 규칙 위반 시 에러 발생
    'no-console': 'off', // 콘솔 로그 허용
  },
};
