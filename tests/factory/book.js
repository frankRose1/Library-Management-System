const faker = require('faker');
const Book = require('../../src/models').Books;

/**
 * Generate an object which container attributes needed
 * to successfully create a book instance.
 *
 * @param  {Object} props Properties to use for the book.
 *
 * @return {Object}       An object to build the book from.
 */
const data = (props = {}) => {
  const defaultProps = {
      title: faker.name.title(),
      author: `${faker.name.firstName()} ${faker.name.lastName()}` ,
      year_published: 2012 ,
      genre: faker.lorem.word(),
      number_in_stock: 4
  };
  return Object.assign({}, defaultProps, props);
};

/**
 * Generates a book instance from the properties provided.
 *
 * @param  {Object} props Properties to use for the book.
 *
 * @return {Object}       A book instance
 */
module.exports = async (props = {}) => await Book.create(data(props));