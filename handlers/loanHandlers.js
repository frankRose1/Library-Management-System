const Loan = require('../models').Loans;

//loan handlers container
const loanHandlers = {};

//needs the book title, patron name, loaned on, return_by, returned_on, action** 
    //action is a button Called "return", if the book is not uet returned, show this button
//getting the book title, and the person name will require queries to the other tables
loanHandlers.allLoans = (req, res) =>{
    Loan.findAll({
        attributes: [

        ]
    })
    .then(loans => {
        res.render('allLoans', {title: 'All Loans', loans});
    })
    .catch(err => {
        res.sendStatus(500);
    });
};

module.exports = loanHandlers;