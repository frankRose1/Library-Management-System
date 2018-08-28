const moment = require('moment');
const Loans = require('../models').Loans;
const Books = require('../models').Books;
const Patrons = require('../models').Patrons;
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

//loan handlers container
const loanHandlers = {};

//loans table has the following fields id(loan id), book_id, patron_id, loaned_on, return_by, returned_on
//needs the book title, patron name, loaned on, return_by, returned_on, action** 
    //action is a button Called "return", if the book is not uet returned, show this button
//getting the book title, and the person name will require queries to the other tables
// id: 1,
// book_id: 15, --> to get the title of the book
// patron_id: 2, --> to get the patrons name
// loaned_on: "2015-12-10",
// return_by: "2020-10-20",
// returned_on: null
//TODO: Query for userNames and Book titles associated with each loan
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
            res.render('loansListing', {titile: 'Loans', loans});
        }).catch(err => {
            console.error(err);
            res.sendStatus(500);
        });
    } else if (query == 'overdue') {
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
            res.render('loansListing', {titile: 'Loans', loans});
        }).catch(err => {
            console.error(err);
            res.sendStatus(500);
        });
    }
};

// Following FIelds are required
    //book_id put it on an option
    //patron_id put it on tan option
    //loaned_on
    //return_by
//loaned_on should be autpopulated with todays date
    //return by should be populated with a day 7 days in the future
//Patron and Book field should be select boxes where you choose the patron or book id
loanHandlers.newLoanForm = (req, res) => {
    //configure the auto populated fields here loaned_on and return_by moment js
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

};

module.exports = loanHandlers;