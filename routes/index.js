//import handlers at the top and initlaize the router --> express.Router
const express = require('express');
const router = express.Router();
const patronHandlers = require('../handlers/patronHandlers');
const bookHandlers = require('../handlers/bookHandlers');
const loanHandlers = require('../handlers/loanHandlers');

// There is a nav present on all pages the books patrons, and loans links will point to /all/books etc... 
    //there is also the same link on the home page sub menu ==> /all/books etc...

//home page
router.get('/', (req, res) => {
    res.render('home', {title: 'Home'});
});

//book routes
router.get('/books/all', bookHandlers.allBooks);
router.get('/books/new', bookHandlers.newBookForm);
router.post('/books/new', bookHandlers.addNewBook);
router.get('/book/details/:id', bookHandlers.getBookDetails);
router.post('/book/details/:id', bookHandlers.updateBook);

//patron routes
//to create a new patron --> /patrons/new
router.get('/patrons/all', patronHandlers.allPatrons);

//loan routes
router.get('/loans/all', loanHandlers.allLoans);
router.get('/loans/filter/:query', loanHandlers.filterLoans);
router.get('/loans/new', loanHandlers.newLoanForm);
router.post('/loans/new', loanHandlers.addNewLoan);

module.exports = router;