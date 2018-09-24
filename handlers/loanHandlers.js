const moment = require('moment');
const Loans = require('../models').Loans;
const Books = require('../models').Books;
const Patrons = require('../models').Patrons;
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const loanHandlers = {};

loanHandlers.allLoans = (req, res, next) =>{
    Loans.findAll({
        include: [
            {
                model: Patrons
            },
            {
                model: Books
            }]
    })
    .then(loans => {
        res.render('loansListing', {title: 'Loans', loans});
    })
    .catch(err => {
        next(err);
    });
};

loanHandlers.filterLoans = (req, res, next) => {
    const {query} = req.params;
    if (query == 'checked') {
        //SELECT * FROM loan WHERE loaned_on <= Date.now() AND returned_on IS NULL
        Loans.findAll({
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
        }).then(loans => {
            res.render('loansListing', {title: 'Checked Out Books', loans});
        }).catch(err => {
            return next(err);
        });
    } 

    if (query == 'overdue') {
        //SELECT * FROM loan WHERE return_by < DATE.now() AND returned_on IS NULL
        Loans.findAll({
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
        }).then(loans => {
            res.render('loansListing', {title: 'Overdue Loans', loans});
        }).catch(err => {
            next(err);
        });
    }
};

loanHandlers.newLoanForm = (req, res, next) => {
    //configure the auto populated fields here loaned_on and return_by
    const loaned_on = moment().format('YYYY-MM-DD');
    const return_by = moment().add(1, 'week').format('YYYY-MM-DD');
    Books.findAll()
        .then(books => {
            Patrons.findAll()
                .then(patrons => {
                    res.render('newLoanForm', {
                                    title: 'New Loan',
                                    books,
                                    patrons,
                                    loaned_on, 
                                    return_by
                    });
                })
                .catch(err => {
                    return next(err);
                });
        })
        .catch(err => {
            next(err);
        });
};

loanHandlers.addNewLoan = (req, res, next) => {
    const {loaned_on, return_by} = req.body;

    Loans.create(req.body)
        .then(loan => {
            //if it saves succefully, redirect to all loans
            res.redirect('/loans/all');
        })
        .catch(err => {
            if (err.name == 'SequelizeValidationError') {
                //re render the form with the errors
                Books.findAll()
                    .then(books => {
                        Patrons.findAll()
                            .then(patrons => {
                                res.render('newLoanForm', {
                                    title: 'New Loan',
                                    errors: err.errors,
                                    books,
                                    patrons,
                                    loaned_on,
                                    return_by
                                });
                            }).catch(err => {
                                return next(err);
                            });
                    }).catch(err => {
                        return next(err);
                    });
            } else {
                throw err;
            }
        })
        .catch(err => {
            //server error creating new loan
            next(err);
        });
};

loanHandlers.returnBookForm = (req, res, next) => {
    const todaysDate = moment().format('YYYY-MM-DD');
    const {id} = req.params;
    Loans.findOne({
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
    }).then(loan => {
        if (loan) {
            res.render('returnBookForm', {title: 'Return Book', loan, todaysDate});
        } else {
            const error = new Error('Loan not found.');
            error.status = 404;
            return next(error);
        }
    }).catch(err => {
        next(err);
    });
};

loanHandlers.updateLoanStatus = (req, res, next) => {
    const {id} = req.params;
    const {returned_on} = req.body;
    Loans.findById(id)
        .then(loan => loan.update({returned_on}))
        .then(loan => {
            //on a succesfull update, redirect to the loans page
            res.redirect('/loans/all');
        }).catch(err => {
            if (err.name == 'SequelizeValidationError') {
                //get the loan and associated patron/book
                Loans.findOne({
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
                }).then(loan => {
                    res.render('returnBookForm', {
                        title: 'Return Books',
                        todaysDate: returned_on,
                        errors: err.errors,
                        loan
                    });
                }).catch(err => {
                    const error = new Error('Loan not found.');
                    error.status = 404;
                    return next(error);
                });
            } else {
                throw err;
            }
        }).catch(err => {
            next(err);
        });
};

module.exports = loanHandlers;