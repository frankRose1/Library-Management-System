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
    res.render('newBookForm', { title: 'New Book', book: {} });
};

bookHandlers.addNewBook = (req, res) => {
    //get data from the form and add it to the DB
    //only title, author, and genre are required. date_published is optional
        Book.create( req.body)
        .then(book => {
            //if it saves successfull. redirect to all books
            res.redirect('/books/all');
        })
        .catch(err => {
            if (err.name == 'SequelizeValidationError') {
                //re-render the form with info about the errors, and auto fill the inputs with values from "book"
                //to get the error message when looping over errors -> error.message
                res.render('newBookForm', {
                    title: 'New Book',
                    errors: err.errors,
                    book: Book.build(req.body)
                });
            } else {
                throw err;
            }
        })
        .catch(err => {
            //server error saving the new book
            res.sendStatus(500);
        });
};

module.exports = bookHandlers;