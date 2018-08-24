const Loan = require('../models').Loans;

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

//FIXME: "return button" should only show if the book loan is utstanding
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

//TODO: filter the loans by overdue and by checked out status
loanHandlers.filterLoans = (req, res) => {
    const {query} = req.params;
    if (query == 'checked') {
        console.log('checked');
        res.sendStatus(200);
    } else if (query == 'overdue') {
        console.log('overdue');
        res.sendStatus(200);
    }
};

module.exports = loanHandlers;