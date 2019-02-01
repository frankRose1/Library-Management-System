const express = require('express');
const router = express.Router();
const moment = require('moment');
const Loans = require('../models').Loans;
const Books = require('../models').Books;
const Patrons = require('../models').Patrons;
const Sequelize = require('sequelize');
const { Op } = Sequelize;
const { validateLoan, validateLoanReturn } = require('../validation')
const createError = require('../utils/createError')
const checkQueryParam = require('../middleware/checkQueryParam')

/**
 * All routes are prefixed with "/loans"
 */

router.get('/all', async (req, res) => {
  const loans = await Loans.findAll({
  include: [
    {
        model: Patrons
    },
    {
        model: Books
    }]
  });
  res.render('loansListing', {title: 'Loans', loans});
});

router.get('/filter/:query', checkQueryParam, async (req, res) => {
  const { query } = req.params;
  let loans;
  if (query == 'checked') {
    //SELECT * FROM loan WHERE loaned_on <= Date.now() AND returned_on IS NULL
    loans = await Loans.findAll({
      include:[
        {
            model: Patrons
        },
        {
            model: Books
        }],
      where: {
        loaned_on: { 
            [Op.lte]: Date.now()
        },
        returned_on: {
            [Op.eq]: null
        }
      }
    });
    res.render('loansListing', {title: 'Checked Out Books', loans});
  } 

  if (query == 'overdue') {
    //SELECT * FROM loan WHERE return_by < DATE.now() AND returned_on IS NULL
    loans = await Loans.findAll({
      include: [
        {
          model: Patrons
        },
        {
          model: Books
        }],
      where: {
        return_by: {
          [Op.lt]: Date.now()
        },
        returned_on: {
          [Op.eq]: null
        }
      }
    });
    res.render('loansListing', {title: 'Overdue Loans', loans});
  }
});

router.get('/new', async (req, res) => {
  //these are the auto populated fields for the loan form
  const loaned_on = moment().format('YYYY-MM-DD');
  const return_by = moment().add(1, 'week').format('YYYY-MM-DD');
  const [books, patrons] = await Promise.all([Books.findAll(), Patrons.findAll()]);
  res.render('newLoanForm', {
    title: 'New Loan',
    books,
    patrons,
    loaned_on, 
    return_by
  });
});

router.post('/new', async (req, res) => {

  const {error, value} = validateLoan(req.body)

  if (error){
    const [books, patrons] = await Promise.all([Books.findAll(), Patrons.findAll()])
    return res
      .status(400)
      .render('newLoanForm', {
        title: 'New Loan',
        errors: error.details,
        loaned_on: req.body.loaned_on,
        return_by: req.body.return_by,
        books,
        patrons,
    })
  }

  await Loans.create(value);

  res.status(201).redirect('/loans/all');
});

router.get('/returns/:id', async (req, res) => {
  const todaysDate = moment().format('YYYY-MM-DD');
  const {id} = req.params;
  const loan = await Loans.findOne({
    where: {
        id: id
    },
    include: [
        {
            model: Patrons
        },
        {
            model: Books
        }]
  });

  if (!loan){
    createError('Loan not found.', 404)
  }

  res.render('returnBookForm', {title: 'Return Book', loan, todaysDate});
});

router.post('/returns/:id', async (req, res) => {

  const loan = await Loans.findOne({
    where: {
      id: req.params.id
    },
    include: [
      {
        model: Patrons
      },
      {
        model: Books
      }
    ]
  });

  if (!loan){
    createError('Loan not found.', 404)
  }

  const { error, value } = validateLoanReturn(req.body);

  if(error){
    return res
      .status(400)
      .render('returnBookForm', {
        title: 'Return Books',
        todaysDate: req.body.returned_on,
        errors: error.details,
        loan
    });
  }
  
  await loan.update(value)
  res.status(204).redirect('/loans/all');
});

module.exports = router