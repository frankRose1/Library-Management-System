const home = require('./home')
const books = require('./books')
const patrons = require('./patrons')
const loans = require('./loans');

/**
 * Register routes with the express application
 * @param {Object} app - express app
 */
module.exports = function(app){
  app.use('/', home);
  app.use('/books', books);
  app.use('/patrons', patrons);
  app.use('/loans', loans);
};