module.exports = {
  apps: [
    {
      name: 'toast-it-api',
      script: 'src/app.js', // 실행할 파일
      instances: 'max', // 모든 CPU 코어 사용
      exec_mode: 'cluster', // 클러스터 모드
      watch: false, // 코드 변경 시 자동 재시작 (개발 환경에서는 true 가능)
      env: {
        NODE_ENV: 'production',
        PORT: 8000,
      },
    },
  ],
};
