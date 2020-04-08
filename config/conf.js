module.exports = {
  development: 'http://localhost:3380',
  production: 'https://api.doallcollect.com',
}[process.env.API_ENV || 'development'];
