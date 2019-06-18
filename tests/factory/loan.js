const faker = require('faker');
const Loan = require('../../src/models').Loans;

/**
 * Generate an object which container attributes needed
 * to successfully create a loan instance.
 *
 * @param  {Object} props Properties to use for the loan.
 *
 * @return {Object}       An object to build the loan from.
 */
const data = (props = {}) => {
  const defaultProps = {};
  return Object.assign({}, defaultProps, props);
};

/**
 * Generates a loan instance from the properties provided.
 *
 * @param  {Object} props Properties to use for the loan.
 *
 * @return {Object}       A loan instance
 */
module.exports = async (props = {}) => await Loan.create(data(props));
