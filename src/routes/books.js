const { Router } = require('express');
const router = Router();
const { Book, Loan, Patron } = require('../models');
const Sequelize = require('sequelize');
const checkQueryParam = require('../middleware/checkQueryParam');
const { Op } = Sequelize;
const { validateBook } = require('../utils/validation');
const createError = require('../utils/createError');
const limit = 5; //show this amount of books per page

async function fetchBooks(req, res) {
  const page = req.params.page || 1;
  const offset = page * limit - limit;

  //skip by the amount of the offset value and fetch the value of limit after that
  const books = await Book.findAndCountAll({
    offset: offset,
    limit: limit
  });

  const count = books.count;
  const pages = Math.ceil(count / limit);
  //if the user tries to access a page that returns no results, redirect them to the final page
  if (!books.rows.length && offset) {
    return res.redirect(`/books/page/${pages}`);
  }

  res.render('bookList', {
    title: 'All Books',
    books: books.rows,
    page,
    pages,
    count
  });
}

async function filterBooks(req, res) {
  const { query } = req.params;
  const page = req.params.page || 1;
  const offset = page * limit - limit;
  let count;
  let pages;
  //only books that are checked out && overdue
  if (query == 'overdue') {
    //SELECT * FROM books WHERE LOANS return_by < Date.now() && returned_on IS NULL
    const books = await Book.findAndCountAll({
      offset: offset,
      limit: limit,
      include: [
        {
          model: Loan,
          where: {
            return_by: {
              [Op.lt]: Date.now()
            },
            returned_on: {
              [Op.eq]: null
            }
          }
        }
      ]
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
    const books = await Book.findAndCountAll({
      offset: offset,
      limit: limit,
      include: [
        {
          model: Loan,
          where: {
            returned_on: {
              [Op.eq]: null
            },
            loaned_on: {
              [Op.lt]: Date.now()
            }
          }
        }
      ]
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

router.get('/', fetchBooks);
router.get('/page/:page', fetchBooks);

router.get('/filter/:query', checkQueryParam, filterBooks);
router.get('/filter/:query/page/:page', checkQueryParam, filterBooks);

router.get('/new', (req, res) => {
  res.render('newBookForm', { title: 'New Book', book: {} });
});

router.post('/new', async (req, res) => {
  const { error, value } = validateBook(req.body);

  if (error) {
    return res.render('newBookForm', {
      title: 'New Book',
      errors: error.details,
      book: Book.build(req.body)
    });
  }

  await Book.create(value);

  res.status(201).redirect('/books/all');
});

router.get('/detail/:id', async (req, res) => {
  const bookId = req.params.id;

  const book = await Book.findOne({
    where: {
      id: bookId
    },
    include: [
      {
        model: Loan,
        include: [
          {
            model: Patron,
            attributes: ['first_name', 'last_name', 'id']
          }
        ]
      }
    ]
  });

  if (!book) {
    createError('Book not found.', 404);
  }

  res.render('updateBookForm', { title: 'Book Details', book });
});

router.post('/detail/:id', async (req, res) => {
  const book = await Book.findOne({
    where: {
      id: req.params.id
    },
    include: [
      {
        model: Loan,
        include: [
          {
            model: Patron,
            attributes: ['first_name', 'last_name', 'id']
          }
        ]
      }
    ]
  });

  if (!book) {
    createError('Book not found', 404);
  }

  const { error, value } = validateBook(req.body);

  if (error) {
    return res.status(400).render('updateBookForm', {
      title: 'Book Details',
      errors: error.details,
      book
    });
  }

  await book.update(value);

  res.redirect('/books');
});

//Users can search a book by title or author. search is case insensitive
router.get('/search', async (req, res) => {
  const { search_query } = req.query;

  const books = await Book.findAll({
    where: {
      [Op.or]: [
        {
          title: {
            [Op.like]: `%${search_query}%`
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

  res.render('bookList', { title: 'Books', books, search_query });
});

module.exports = router;
