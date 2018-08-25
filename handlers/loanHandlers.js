const Loan = require('../models').Loans;
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
        attributes: { exclude: ['created_at', 'updated_at'] }
    })
    .then(loans => {
        res.render('allLoans', {title: 'Loans', loans});
    })
    .catch(err => {
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
        //SELECT * FROM loan WHERE return_by > DATE.now() AND returned_on IS NULL
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

module.exports = loanHandlers;