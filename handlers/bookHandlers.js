const Books = require('../models').Books;
const Loans = require('../models').Loans;
const Patrons = require('../models').Patrons;
const Sequelize = require('sequelize');
const { Op } = Sequelize;
//for pagination
const limit = 5; //show this amount of books per page


const bookHandlers = {};

bookHandlers.allBooks = (req, res) => {
    const page = req.params.page || 1;
    const offset = (page * limit) - limit;

    //skip by the amount of the offset value and fetch the value of limit after that 
    Books.findAndCountAll({
        offset: offset,
        limit: limit
    }).then(books => {
        //get book count and number of pages
        const count = books.count;
        const pages = Math.ceil(count / limit);
        //if the user tries to access a page that returns no results, redirect them to the final page
        if (!books.rows.length && offset) {
            res.redirect(`/books/all/page/${pages}`);
            return;
        }

        res.render('allBooks', {
                                title: 'All Books', 
                                books: books.rows, 
                                page, 
                                pages, 
                                count
                            });
    }).catch(err => {
        res.sendStatus(500);
    });
}

bookHandlers.newBookForm = (req, res) => {
    res.render('newBookForm', { title: 'New Book', book: {} });
};

bookHandlers.filterBooks = (req, res) => {
    const {query} = req.params;
    const page = req.params.page || 1;
    const offset = (page * limit) - limit;
    //only books that are checked out && overdue
    if (query == 'overdue') {
        //SELECT * FROM books WHERE LOANS return_by < Date.now() && returned_on IS NULL
        Books.findAndCountAll({
            offset: offset,
            limit: limit,
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
            const count = books.count;
            const pages = Math.ceil(count / limit);
            res.render('filteredBooks', {
                                        title: 'Overdue Books', 
                                        books: books.rows,
                                        page,
                                        pages,
                                        count,
                                        query
                                });
        }).catch(err => {
            res.sendStatus(500);
        });
    }
    //all books that are currently checked out
    if (query == 'checked') {
        // SELECT * FROM books WHERE LOANS returned_on IS NULL && loaned_on < Date.now()
        Books.findAndCountAll({
            offset: offset,
            limit: limit,
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
            const count = books.count;
            const pages = Math.ceil(count / limit);
            res.render('filteredBooks', {
                                    title: 'Checked Out Books', 
                                    books: books.rows,
                                    page,
                                    pages,
                                    count,
                                    query
                                });
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

//Users can search a book by title or author. search is case insensitive
bookHandlers.searchBooks = (req, res) => {
    const {search_query} = req.body;
    Books.findAll({
        where: {
            [Op.or] : [
                {
                    title: {
                        [Op.like] : `%${search_query}%`
                    }
                },
                { 
                    author: {
                        [Op.like]: `%${search_query}%`
                    }
                }
            ]
        }
    }).then(books => {
        res.render('allBooks', {title: 'Books', books, search_query});
    }).catch(err => {
        res.sendStatus(500);
    });
};

module.exports = bookHandlers;