const moment = require('moment');
const Loan = require('../models').Loans;
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
    Loan.findAll({
        includes: [
            {
                model: Patrons
            },
            {
                model: Books
            }]
    })
    .then(loans => {
        console.log(loans);
        res.render('allLoans', {title: 'Loans', loans});
    })
    .catch(err => {
        console.log(err);
        res.sendStatus(500);
    });
};

loanHandlers.filterLoans = (req, res) => {
    const {query} = req.params;
    if (query == 'checked') {
        //SELECT * FROM loan WHERE loaned_on < Date.now() AND returned_on IS NULL
        Loan.findAll({
            where: {
                loaned_on: { 
                    [Op.lt]: Date.now()
                },
                returned_on: {
                    [Op.eq]: null
                }
            }
        }).then(loans => {
            res.render('allLoans', {titile: 'Loans', loans});
        }).catch(err => {
            console.error(err);
            res.sendStatus(500);
        });
    } else if (query == 'overdue') {
        //SELECT * FROM loan WHERE return_by < DATE.now() AND returned_on IS NULL
        Loan.findAll({
            where: {
                return_by: {
                    [Op.lt]: Date.now()
                },
                returned_on: {
                    [Op.eq]: null
                }
            }
        }).then(loans => {
            res.render('allLoans', {titile: 'Loans', loans});
        }).catch(err => {
            console.error(err);
            res.sendStatus(500);
        });
    }
};

// Following FIelds are required
    //book_id
    //patron_id
    //loaned_on
    //return_by
//loaned_on should be autpopulated with todays date
    //return by should be populated with a day 7 days in the future
//Patron and Book field should be select boxes where you choose the patron or book id
loanHandlers.newLoanForm = (req, res) => {
    //configure the auto populated fields here loaned_on and return_by moment js
    const loaned_on = moment().format('YYYY-MM-DD');
    const return_by = moment(loaned_on, 'YYYY-MM-DD').endOf('week').fromNow();
    res.render('newLoanForm', {title: 'New Loan', loaned_on, return_by});
};

loanHandlers.addNewLoan = (req, res) => {

};

module.exports = loanHandlers;