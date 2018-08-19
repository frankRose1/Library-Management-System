const Book = require('../models').Books;

// book handlers container
const bookHandlers = {};

//TODO id is needed for a link to individual book page
bookHandlers.allBooks = (req, res) => {
    Book.findAll({
        attributes: [
            'title',
            'author',
            'genre',
            'first_published',
            'id'
        ]
    })
    .then(books => {
        res.render('allBooks', {title: 'All Books', books});
    })
    .catch(err => {
        res.sendStatus(500);
    });
}

bookHandlers.newBookForm = (req, res) => {
    res.render('newBookForm', {title: 'Add New Book'});
};

//post route, where we create a new entry in the DB
// validate all fields in the DB
// if there is an error, re render the form with error messages
bookHandlers.addNewBook = (req, res) => {
    //get data from the form and add it to the DB
    //validate all fields are present because all are required
};

module.exports = bookHandlers;