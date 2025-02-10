module.exports = {
  apps: [
    {
      name: 'toast-it-api',
      script: 'src/app.js',
      instances: 1,
      exec_mode: 'fork',
      watch: false,
      env: {
        NODE_ENV: 'production',
        PORT: 8000,
      },
    },
  ],
};
