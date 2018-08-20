const Book = require('../models').Books;

// book handlers container
const bookHandlers = {};

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
    //only title, author, and genre are required. date_published is optional
        Book.create( req.body)
            .then(book => {
                //if it saves successfull. redirect to all books
                res.redirect('/books/all');
            })
            .catch(err => {
                if (err.name == 'SequelizeValidationError') {
                    //re-render the form with info about the errors, and auto fill the inputs with values from "book"
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

//render the form for updating a book, populated with a books existing information
bookHandlers.getBookDetails = (req, res) => {
    //render a form with the books information
    const bookId = req.params.id;
    Book.findById(bookId)
        .then(book => {
            console.log(book);
            res.render('updateBookForm', {title: 'Book Details', book});
        })
        .catch(err => {
            res.sendStatus(404); //book not found
        });
    
};

//update the book in the db once the form is submitted
bookHandlers.updateBook = (req, res) => {

};

module.exports = bookHandlers;