const Books = require('../models').Books;
const Loans = require('../models').Loans;
const Patrons = require('../models').Patrons;
const Sequelize = require('sequelize');
const { Op } = Sequelize;

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
    }).then(books => {
        res.render('allBooks', {title: 'All Books', books});
    }).catch(err => {
        res.sendStatus(500);
    });
}

bookHandlers.newBookForm = (req, res) => {
    res.render('newBookForm', { title: 'New Book', book: {} });
};

bookHandlers.filterBooks = (req, res) => {
    const {query} = req.params;
    //only books that are checked out && overdue
    if (query == 'overdue') {
        //SELECT * FROM books WHERE LOANS return_by < Date.now() && returned_on IS NULL
        Books.findAll({
            include : [
                {
                    model: Loans,
                    where: {
                        return_by : {
                            [Op.lt]: Date.now()
                        },
                        returned_on: {
                            [Op.eq]: null
                        }
                    }
                }]
        }).then(books => {
            res.render('allBooks', {title: 'Overdue Books', books});
        }).catch(err => {
            res.sendStatus(500);
        });
    }
    //all books that are currently checked out
    if (query == 'checked') {
        // SELECT * FROM books WHERE LOANS returned_on IS NULL && loaned_on < Date.now()
        Books.findAll({
            include: [
                {
                    model: Loans,
                    where: {
                        returned_on: {
                            [Op.eq]: null
                        },
                        loaned_on: {
                            [Op.lt]: Date.now()
                        }
                    }
                }]
        }).then(books => {
            res.render('allBooks', {title: 'Checked Out Books', books});
        }).catch(err => {
            res.sendStatus(500);
        });
    }
};

bookHandlers.addNewBook = (req, res) => {
    Books.create(req.body)
            .then(book => {
                //if it saves successfull, redirect to all books
                res.redirect('/books/all');
            }).catch(err => {
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
            }).catch(err => {
                res.sendStatus(500);
            });
};


bookHandlers.getBookDetails = (req, res) => {
    const bookId = req.params.id;
    Books.findOne({
        where: {
            id: bookId
        },
        include: [
            {
                model: Loans,
                include: [{
                        model: Patrons,
                        attributes: ['first_name', 'last_name', 'id']
                    }
                ]
            }]
    }).then(book => {
        if (book) {
            res.render('updateBookForm', {title: 'Book Details', book});
        } else {
            res.sendStatus(404);
        }
    }).catch(err => {
        res.sendStatus(500);
    });;
};


bookHandlers.updateBook = (req, res) => {
    const bookId = req.params.id;
    Books.findById(bookId)
        .then(book => book.update(req.body))
        .then(book => {
            //if the book updates and saves without error redirect to all books page
            res.redirect('/books/all');
        })
        .catch(err => {
            if (err.name == 'SequelizeValidationError') {
                Books.findOne({
                    where: {
                        id: bookId
                    },
                    include: [{
                            model: Loans,
                            include: [{
                                model: Patrons,
                                attributes: ['first_name', 'last_name', 'id']
                            }]
                        }]
                }).then(book => {
                    if (book) {
                        res.render('updateBookForm', {
                            title: 'Book Details',
                            errors: err.errors,
                            book
                        });
                    } else {
                        res.sendStatus(404);
                    }
                }).catch(err => {
                    res.sendStatus(500);
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