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

//patron routes
//to create a new patron --> /patrons/new
router.get('/patrons/all', patronHandlers.allPatrons);

//books routes
router.get('/books/all', bookHandlers.allBooks);

//loans routes

module.exports = router;