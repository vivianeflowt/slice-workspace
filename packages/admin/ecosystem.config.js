module.exports = {
  apps: [
    {
      name: 'backend',
      script: 'backend/main.py',
      interpreter: 'python3',
      args: '',
      cwd: __dirname,
      env: {
        PORT: 11111,
      },
    },
    {
      name: 'frontend',
      script: 'vite',
      args: 'preview',
      cwd: __dirname,
      interpreter: 'node',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
