module.exports = {
  development: 'http://120.55.60.49:3380',
  production: 'https://api.doallcollect.com'
}[process.env.API_ENV || 'development'];
