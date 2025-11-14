module.exports = {
  port: 3000,
  host: 'localhost',
  watch: true,
  routes: {
    '/api/*': '/$1'
  },
  middlewares: [
    function(req, res, next) {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
      res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
      next();
    }
  ]
}
