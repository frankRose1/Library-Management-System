const express = require('express');
const router = express.Router();
const patronHandlers = require('../handlers/patronHandlers');
const bookHandlers = require('../handlers/bookHandlers');
const loanHandlers = require('../handlers/loanHandlers');
const checkQueryParam = require('../middleware/checkQueryParam');

//home page
router.get('/', (req, res) => {
    res.render('home', {title: 'Home'});
});

//book routes
router.get('/books/all', bookHandlers.allBooks);
router.get('/books/all/page/:page', bookHandlers.allBooks); //for pagination
router.get('/books/filter/:query', checkQueryParam, bookHandlers.filterBooks);
router.get('/books/filter/:query/page/:page', checkQueryParam, bookHandlers.filterBooks); //for pagination
router.get('/books/new', bookHandlers.newBookForm);
router.post('/books/new', bookHandlers.addNewBook);
router.get('/book/details/:id', bookHandlers.getBookDetails);
router.post('/book/details/:id', bookHandlers.updateBook);
router.post('/books/search', bookHandlers.searchBooks); // search feature

//patron routes
router.get('/patrons/all', patronHandlers.allPatrons);
router.get('/patrons/all/page/:page', patronHandlers.allPatrons); //for pagination
router.get('/patrons/new', patronHandlers.newPatronForm);
router.post('/patrons/new', patronHandlers.createNewPatron);
router.get('/patron/details/:id', patronHandlers.patronDetails);
router.post('/patron/details/:id', patronHandlers.updatePatron);
router.post('/patrons/search', patronHandlers.searchPatrons); // search feature


//loan routes
router.get('/loans/all', loanHandlers.allLoans);
router.get('/loans/filter/:query', checkQueryParam, loanHandlers.filterLoans);
router.get('/loans/new', loanHandlers.newLoanForm);
router.post('/loans/new', loanHandlers.addNewLoan);
router.get('/loan/return/:id', loanHandlers.returnBookForm);
router.post('/loan/return/:id', loanHandlers.updateLoanStatus);

module.exports = router;