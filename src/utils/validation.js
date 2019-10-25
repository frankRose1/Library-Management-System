const Joi = require('@hapi/joi')
    .extend(require('@hapi/joi-date'));

const validateOptions = {
  abortEarly: false,
  stripUnknown: true
};

const validatePatron = patronData => {
  const schema = Joi.object({
    first_name: Joi.string().min(2).max(40).alphanum().required(),
    last_name: Joi.string().min(2).max(40).alphanum().required(),
    address: Joi.string().max(80).required(),
    zip_code: Joi.string().regex(/^\d{5}$/).required(),
    email: Joi.string().email().required(),
    library_id: Joi.string().min(7).max(15).required()
  });

  return schema.validate(patronData, validateOptions);
};

const validateBook = bookData => {
  // published date cant me more than the current year
  const currentYear = new Date().getFullYear();
  const schema = Joi.object({
    title: Joi.string().max(250).required(),
    author: Joi.string().max(150).required(),
    genre: Joi.string().max(60).required(),
    first_published: Joi.number().integer().max(currentYear),
    number_in_stock: Joi.number().integer().min(0).max(100).required()
  });

  return schema.validate(bookData, validateOptions);
};

const validateLoan = loanData => {
  const schema = Joi.object({
    book_id: Joi.number().integer().min(1).required(),
    patron_id: Joi.number().integer().min(1).required(),
    loaned_on: Joi.date().format('YYYY-MM-DD').required(),
    return_by: Joi.date().format('YYYY-MM-DD').required()
  });

  return schema.validate(loanData, validateOptions);
};

const validateLoanReturn = returnData => {
  const schema = Joi.object({
    returned_on: Joi.date().format('YYYY-MM-DD').required()
  });

  return schema.validate(returnData, validateOptions);
};

exports.validatePatron = validatePatron;
exports.validateBook = validateBook;
exports.validateLoan = validateLoan;
exports.validateLoanReturn = validateLoanReturn;