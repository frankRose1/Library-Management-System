const Books = require('../models').Books;
const Loans = require('../models').Loans;
const Patrons = require('../models').Patrons;

// book handlers container
const bookHandlers = {};

bookHandlers.allBooks = (req, res) => {
    Books.findAll({
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
    Books.create( req.body)
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
                        book: Books.build(req.body)
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
    const bookId = req.params.id;
    Books.findById(bookId)
        .then(book => {
            //find any loans associated with this book
            Loans.findAll({
                where: {book_id: bookId},
                include: [{
                    model: Patrons,
                    attributes:['first_name', 'last_name', 'id']
                },
                {
                    model: Books
                }]
            }).then(loans => {
                if (book) {
                    console.log(loans);
                    res.render('updateBookForm', {title: 'Book Details', book, loans});
                } else {
                    res.sendStatus(404);
                }     
            }).catch(err => {
                console.log(err);
                res.sendStatus(500);
            });
        }).catch(err => {
            res.sendStatus(404); //book not found
        });
};


bookHandlers.updateBook = (req, res) => {
    const bookId = req.params.id;
    const bookTitle = req.body.title;
    Books.findById(bookId)
        .then(book => book.update(req.body))
        .then(book => {
            //if the book updates and saves without error redirect to all books page
            res.redirect('/books/all');
        })
        .catch(err => {
            //bookId retains the reference to the book incase the form is submitted with errors
            if (err.name == 'SequelizeValidationError') {
                res.render('updateBookForm', {
                    title: 'Book Details',
                    errors: err.errors,
                    book: Book.build(req.body),
                    bookId,
                    bookTitle
                });
            } else {
                throw err;
            }
        })
        .catch(err => {
            res.sendStatus(500);
        });
};

module.exports = bookHandlers;