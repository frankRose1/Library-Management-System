const faker = require('faker');
const Patron = require('../../src/models').Patrons;

/**
 * Generate an object which container attributes needed
 * to successfully create a patron instance.
 *
 * @param  {Object} props Properties to use for the patron.
 *
 * @return {Object}       An object to build the patron from.
 */
const data = (props = {}) => {
  const defaultProps = {
    first_name: faker.name.firstName(),
    last_name: faker.name.lastName(),
    email: faker.internet.email(),
    address: faker.address.streetAddress(),
    zip_code: parseInt(faker.address.zipCode()),
    library_id: faker.random.alphaNumeric()
  };
  return Object.assign({}, defaultProps, props);
};

/**
 * Generates a patron instance from the properties provided.
 *
 * @param  {Object} props Properties to use for the patron.
 *
 * @return {Object}       A patron instance
 */
module.exports = async (props = {}) => await Patron.create(data(props));
