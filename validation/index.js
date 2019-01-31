const Joi = require('joi');

const validateOptions = {
  abortEarly: false,
  stripUnknown: true
}

function validatePatron(patronData){
  const schema = Joi.object().keys({
    first_name: Joi.string().alphanum().required(),
    last_name: Joi.string().alphanum().required(),
    address: Joi.string().required(),
    zip_code: Joi.number().integer().required(),
    email: Joi.string().email().required(),
    library_id: Joi.string().required()
  });

  return Joi.validate(patronData, schema, validateOptions);
}

function validateBook(bookData){
  const schema = Joi.object().keys({
    title: Joi.string().required(),
    author: Joi.string().required(),
    genre: Joi.string().required(),
    first_published: Joi.number().integer()
  });

  return Joi.validate(bookData, schema, validateOptions)
}

function validateLoan(loanData){
  const schema = Joi.object().keys({
    book_id: Joi.number().integer().required(),
    patron_id: Joi.number().integer().required(),
    loaned_on: Joi.string().required(),
    return_by: Joi.string().required()
  });

  return Joi.validate(loanData, schema, validateOptions);
}

function validateLoanReturn(returnData){
  const schema = Joi.object().keys({
    returned_on: Joi.string().required()
  })

  return Joi.validate(returnData, schema, validateOptions)
}

exports.validatePatron = validatePatron
exports.validateBook = validateBook
exports.validateLoan = validateLoan
exports.validateLoanReturn = validateLoanReturn