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

module.exports = bookHandlers;