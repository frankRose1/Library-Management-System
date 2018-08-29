const express = require('express');
const router = express.Router();
const patronHandlers = require('../handlers/patronHandlers');
const bookHandlers = require('../handlers/bookHandlers');
const loanHandlers = require('../handlers/loanHandlers');

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
router.get('/patrons/all', patronHandlers.allPatrons);
router.get('/patron/details/:id', patronHandlers.patronDetails);
router.post('/patron/details/:id', patronHandlers.updatePatron);

//loan routes
router.get('/loans/all', loanHandlers.allLoans);
router.get('/loans/filter/:query', loanHandlers.filterLoans);
router.get('/loans/new', loanHandlers.newLoanForm);
router.post('/loans/new', loanHandlers.addNewLoan);
router.get('/loan/return/:id', loanHandlers.returnBookForm);
router.post('/loan/return/:id', loanHandlers.updateLoanStatus);

module.exports = router;