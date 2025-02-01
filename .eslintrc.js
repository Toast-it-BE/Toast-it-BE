module.exports = {
  env: {
    node: true,
    es2021: true,
  },
  extends: ['airbnb-base', 'plugin:prettier/recommended'], // Airbnb 스타일 가이드 & Prettier 통합
  plugins: ['prettier'], // Prettier 플러그인
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx'], // 사용할 파일 확장자 추가
      },
    },
  },
  rules: {
    'prettier/prettier': 'error', // Prettier 규칙 위반 시 에러 발생
    'no-console': 'off', // 콘솔 로그 허용
    'import/no-extraneous-dependencies': [
      'error',
      {
        packageDir: './',
      },
    ],
  },
};
