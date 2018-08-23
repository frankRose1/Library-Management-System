const Book = require('../models').Books;
const Loan = require('../models').Loans;

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
//TODO: ==> will need to also find loans associated with this book ID**
bookHandlers.getBookDetails = (req, res) => {
    
    const bookId = req.params.id;
    Book.findById(bookId)
        .then(book => {
            //find any loans associated with this book
            Loan.findAll({
                where: {book_id: bookId}
            })
                .then(loans => {
                    res.render('updateBookForm', {title: 'Book Details', book, loans});
                })
                .catch(err => {
                    console.log(err);
                    res.sendStatus(500);
                });
        })
        .catch(err => {
            res.sendStatus(404); //book not found
        });
    
};

//TODO: show any outstanding loans if they are present
//loans table has the following fields id(loan id), book_id, patron_id, loaned_on, return_by, returned_on
bookHandlers.updateBook = (req, res) => {
    const bookId = req.params.id;
    const bookTitle = req.body.title;
    Book.findById(bookId)
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