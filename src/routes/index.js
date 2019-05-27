const home = require('./home')
const books = require('./books')
const patrons = require('./patrons')
const loans = require('./loans');

module.exports = function(app){
  app.use('/', home)
  app.use('/books', books)
  app.use('/patrons', patrons)
  app.use('/loans', loans)
}