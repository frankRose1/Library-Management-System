const Books = require('../models').Books;
const Loans = require('../models').Loans;
const Patrons = require('../models').Patrons;
const Sequelize = require('sequelize');
const { Op } = Sequelize;
const createError = require('../utils/createError');
const limit = 5; //show this amount of books per page


const bookHandlers = {};

bookHandlers.allBooks = async (req, res) => {
  const page = req.params.page || 1;
  const offset = (page * limit) - limit;

  //skip by the amount of the offset value and fetch the value of limit after that 
  const books = await Books.findAndCountAll({
      offset: offset,
      limit: limit
  });

  const count = books.count;
  const pages = Math.ceil(count / limit);
  //if the user tries to access a page that returns no results, redirect them to the final page
  if (!books.rows.length && offset) {
    return res.redirect(`/books/all/page/${pages}`);
  }

  res.render('allBooks', {
    title: 'All Books', 
    books: books.rows, 
    page, 
    pages, 
    count
  });
}

bookHandlers.newBookForm = (req, res) => {
    res.render('newBookForm', { title: 'New Book', book: {} });
};

bookHandlers.filterBooks = async (req, res) => {
  const {query} = req.params;
  const page = req.params.page || 1;
  const offset = (page * limit) - limit;
  let count;
  let pages;
  //only books that are checked out && overdue
  if (query == 'overdue') {
    //SELECT * FROM books WHERE LOANS return_by < Date.now() && returned_on IS NULL
    const books = await Books.findAndCountAll({
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
    });
    count = books.count;
    pages = Math.ceil(count / limit);
    res.render('filteredBooks', {
      title: 'Overdue Books', 
      books: books.rows,
      page,
      pages,
      count,
      query
    });
  }
  //all books that are currently checked out
  if (query == 'checked') {
    // SELECT * FROM books WHERE LOANS returned_on IS NULL && loaned_on < Date.now()
    const books = await Books.findAndCountAll({
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
    });
    count = books.count;
    pages = Math.ceil(count / limit);
    res.render('filteredBooks', {
      title: 'Checked Out Books', 
      books: books.rows,
      page,
      pages,
      count,
      query
    });
  }
};

bookHandlers.addNewBook = (req, res, next) => {
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
                next(err);
            });
};


bookHandlers.getBookDetails = async (req, res) => {
  const bookId = req.params.id;
  const book = await Books.findOne({
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
  });
  if (!book){
    createError('Book not found.', 404)
  }
  res.render('updateBookForm', {title: 'Book Details', book});
};


bookHandlers.updateBook = (req, res, next) => {
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
                        const error = new Error('Book not found');
                        error.status = 404;
                        return next(error);
                    }
                }).catch(err => {
                    return next(err);
                });
            } else {
                throw err;
            }
        })
        .catch(err => {
            next(err);
        });
};

//Users can search a book by title or author. search is case insensitive
bookHandlers.searchBooks = async (req, res) => {
  const { search_query } = req.body;
  const books = await Books.findAll({
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
  });
  res.render('allBooks', {title: 'Books', books, search_query});
};

module.exports = bookHandlers;