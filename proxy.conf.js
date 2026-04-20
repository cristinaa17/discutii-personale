const target = process.env.API_TARGET || 'http://localhost:3001';

module.exports = [
  {
    context: ['/api', '/uploads'],
    target,
    secure: false,
    changeOrigin: true,
    logLevel: 'warn',
  },
];
