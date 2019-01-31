const express = require('express');
const router = express.Router()
const Books = require('../models').Books;
const Loans = require('../models').Loans;
const Patrons = require('../models').Patrons;
const Sequelize = require('sequelize');
const checkQueryParam = require('../middleware/checkQueryParam')
const { Op } = Sequelize;
const { validateBook } = require('../validation')
const createError = require('../utils/createError');
const limit = 5; //show this amount of books per page

async function fetchBooks(req, res){
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

async function filterBooks(req, res){
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
}

/** 
 * All routes are prefixed with "/books"
 */
router.get('/all', fetchBooks);
router.get('/all/page/:page', fetchBooks);

router.get('/filter/:query', checkQueryParam, filterBooks);
router.get('/filter/:query/page/:page', checkQueryParam, filterBooks);

router.get('/new', (req, res) => {
  res.render('newBookForm', { title: 'New Book', book: {} });
});

router.post('/new', async (req, res ) => {
  const { error, value } = validateBook(req.body);

  if (error) {
    return res.render('newBookForm', {
      title: 'New Book',
      errors: error.details,
      book: Books.build(req.body)
    });
  }

  await Books.create(value);
  res.status(201).redirect('/books/all');
});

router.get('/details/:id', async (req, res) => {
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
});

router.post('/details/:id', async (req, res) => {

  const book = await Books.findOne({
    where: {
      id: req.params.id
    },
    include: [{
      model: Loans,
      include: [{
        model: Patrons,
        attributes: ['first_name', 'last_name', 'id']
      }]
    }]
  });

  if (!book) {
    createError('Book not found', 404)
  }

  const { error, value } = validateBook(req.body);
  if (error){
    return res
      .status(400)
      .render('updateBookForm', {
        title: 'Book Details',
        errors: error.details,
        book
    });
  }

  await book.update(value)
  res.status(204).redirect('/books/all')
});

//Users can search a book by title or author. search is case insensitive
router.post('/search', async (req, res) => {
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
});

module.exports = router;