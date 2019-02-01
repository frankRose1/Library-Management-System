const BaseJoi = require('joi');
const Extension = require('joi-date-extensions')
const Joi = BaseJoi.extend(Extension);

const validateOptions = {
  abortEarly: false,
  stripUnknown: true
}

function validatePatron(patronData){
  const schema = Joi.object().keys({
    first_name: Joi.string().min(2).max(40).alphanum().required(),
    last_name: Joi.string().min(2).max(40).alphanum().required(),
    address: Joi.string().max(80).required(),
    zip_code: Joi.string().regex(/^\d{5}$/).required(),
    email: Joi.string().email().required(),
    library_id: Joi.string().min(7).max(15).required()
  });

  return Joi.validate(patronData, schema, validateOptions);
}

function validateBook(bookData){
  // published date cant me more than the current year
  const currentYear = new Date().getFullYear()
  const schema = Joi.object().keys({
    title: Joi.string().max(250).required(),
    author: Joi.string().max(150).required(),
    genre: Joi.string().max(60).required(),
    first_published: Joi.number().integer().max(currentYear)
  });

  return Joi.validate(bookData, schema, validateOptions)
}

function validateLoan(loanData){
  const schema = Joi.object().keys({
    book_id: Joi.number().integer().min(1).required(),
    patron_id: Joi.number().integer().min(1).required(),
    loaned_on: Joi.date().format('YYYY-MM-DD').required(),
    return_by: Joi.date().format('YYYY-MM-DD').required()
  });

  return Joi.validate(loanData, schema, validateOptions);
}

function validateLoanReturn(returnData){
  const schema = Joi.object().keys({
    returned_on: Joi.date().format('YYYY-MM-DD').required()
  })

  return Joi.validate(returnData, schema, validateOptions)
}

exports.validatePatron = validatePatron
exports.validateBook = validateBook
exports.validateLoan = validateLoan
exports.validateLoanReturn = validateLoanReturn