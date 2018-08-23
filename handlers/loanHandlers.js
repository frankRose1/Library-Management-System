const Loan = require('../models').Loans;

//loan handlers container
const loanHandlers = {};

//loans table has the following fields id(loan id), book_id, patron_id, loaned_on, return_by, returned_on
//needs the book title, patron name, loaned on, return_by, returned_on, action** 
    //action is a button Called "return", if the book is not uet returned, show this button
//getting the book title, and the person name will require queries to the other tables
loanHandlers.allLoans = (req, res) =>{
    Loan.findAll({
        attributes: { exclude: ['created_at', 'updated_at'] }
    })
    .then(loans => {
        res.json(loans);
        // res.render('allLoans', {title: 'All Loans', loans});
    })
    .catch(err => {
        res.sendStatus(500);
    });
};

module.exports = loanHandlers;