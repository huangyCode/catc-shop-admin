module.exports = {
  development: 'http://localhost:3380',
  production: 'http://47.114.129.233:3380',
}[process.env.API_ENV || 'development'];
