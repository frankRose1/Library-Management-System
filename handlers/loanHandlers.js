const moment = require('moment');
const Loans = require('../models').Loans;
const Books = require('../models').Books;
const Patrons = require('../models').Patrons;
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

//loan handlers container
const loanHandlers = {};

loanHandlers.allLoans = (req, res) =>{
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
        res.sendStatus(500);
    });
};

loanHandlers.filterLoans = (req, res) => {
    const {query} = req.params;
    if (query == 'checked') {
        //SELECT * FROM loan WHERE loaned_on < Date.now() AND returned_on IS NULL
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
                    [Op.lt]: Date.now()
                },
                returned_on: {
                    [Op.eq]: null
                }
            }
        }).then(loans => {
            res.render('loansListing', {title: 'Checked Out Books', loans});
        }).catch(err => {
            res.sendStatus(500);
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
            res.render('loansListing', {title: 'Overdue Books', loans});
        }).catch(err => {
            res.sendStatus(500);
        });
    }
};

loanHandlers.newLoanForm = (req, res) => {
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
                    res.sendStatus(500);
                });
        })
        .catch(err => {
            res.sendStatus(500);
        });
};

loanHandlers.addNewLoan = (req, res) => {
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
                                res.sendStatus(500);
                            });
                    }).catch(err => {
                        res.sendStatus(500);
                    });
            } else {
                throw err;
            }
        })
        .catch(err => {
            //server error creating new loan
            res.sendStatus(500);
        });
};

loanHandlers.returnBookForm = (req, res) => {
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
            res.sendStatus(404);
        }
    }).catch(err => {
        res.sendStatus(500);
    });
};

loanHandlers.updateLoanStatus = (req, res) => {
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
                    res.sendStatus(500); //loan not found
                });
            } else {
                throw err;
            }
        }).catch(err => {
            res.sendStatus(500);
        });
};

module.exports = loanHandlers;