const loans = require('./loans');

module.exports = function(app){
  app.use('/loans', loans)
}