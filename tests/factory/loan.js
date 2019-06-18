const Loan = require('../../src/models').Loans;
const bookFactory = require('./book');
const patronFactory = require('./patron');
const moment = require('moment');

/**
 * Generate an object which container attributes needed
 * to successfully create a loan instance.
 *
 * @param  {Object} props Properties to use for the loan.
 *
 * @return {Object}       An object to build the loan from.
 */
const data = (props = {}) => {
  // needs a patron and book ID
  const defaultProps = {
    loaned_on: moment().format('YYYY-MM-DD'),
    return_by: moment()
      .add(1, 'week')
      .format('YYYY-MM-DD')
  };
  return Object.assign({}, defaultProps, props);
};

/**
 * Generates a loan instance from the properties provided.
 * Since a loan shares a relationship with a book and a patron you may pass
 * in props for the patron and book which will be created anyway. (e.g. if you want to test a book with a
 * "number_on_stock" of 0)
 *
 * @param  {Object} loanProps Properties to use for the loan.
 * @param  {Object} patronProps Properties to use for the patron.
 * @param  {Object} bookProps Properties to use for the book.
 *
 * @return {Object}       A loan instance
 */
module.exports = async (loanProps = {}, patronProps = {}, bookProps = {}) => {
  const [patron, book] = await Promise.all([
    patronFactory(patronProps),
    bookFactory(bookProps)
  ]);
  loanProps = Object.assign({}, loanProps, {
    patron_id: patron.id,
    book_id: book.id
  });
  const loan = await Loan.create(data(loanProps));
  return loan;
};
