'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Books', [
      {
        "id": 1,
        "title": "Harry Potter and the Philosopher's Stone",
        "author": "J.K. Rowling",
        "genre": "Fantasy",
        "first_published": 1997,
        "number_in_stock": 6
      },
      {
        "id": 2,
        "title": "Harry Potter and the Chamber of Secrets",
        "author": "J.K. Rowling",
        "genre": "Fantasy",
        "first_published": 1998,
        "number_in_stock": 8
      },
      {
        "id": 3,
        "title": "Harry Potter and the Prisoner of Azkaban",
        "author": "J.K. Rowling",
        "genre": "Fantasy",
        "first_published": 1999,
        "number_in_stock": 4
      },
      {
        "id": 4,
        "title": "Harry Potter and the Goblet of Fire",
        "author": "J.K. Rowling",
        "genre": "Fantasy",
        "first_published": 2000,
        "number_in_stock": 2
      },
      {
        "id": 5,
        "title": "Harry Potter and the Order of the Phoenix",
        "author": "J.K. Rowling",
        "genre": "Fantasy",
        "first_published": 2003,
        "number_in_stock": 3
      },
      {
        "id": 6,
        "title": "Harry Potter and the Half-Blood Prince",
        "author": "J.K. Rowling",
        "genre": "Fantasy",
        "first_published": 2005,
        "number_in_stock": 4
      },
      {
        "id": 7,
        "title": "Harry Potter and the Deathly Hallows",
        "author": "J.K. Rowling",
        "genre": "Fantasy",
        "first_published": 2007,
        "number_in_stock": 2
      },
      {
        "id": 8,
        "title": "A Brief History of Time",
        "author": "Stephen Hawking",
        "genre": "Non Fiction",
        "first_published": 1988,
        "number_in_stock": 0
      },
      {
        "id": 9,
        "title": "The Universe in a Nutshell",
        "author": "Stephen Hawking",
        "genre": "Non Fiction",
        "first_published": 2001,
        "number_in_stock": 0
      },
      {
        "id": 10,
        "title": "Frankenstein",
        "author": "Mary Shelley",
        "genre": "Horror",
        "first_published": 1818,
        "number_in_stock": 11
      },
      {
        "id": 11,
        "title": "The Martian",
        "author": "Andy Weir",
        "genre": "Science Fiction",
        "first_published": 2014,
        "number_in_stock": 1
      },
      {
        "id": 12,
        "title": "Ready Player One",
        "author": "Ernest Cline",
        "genre": "Science Fiction",
        "first_published": 2011,
        "number_in_stock": 7
      },
      {
        "id": 13,
        "title": "Armada",
        "author": "Ernest Cline",
        "genre": "Science Fiction",
        "first_published": 2015,
        "number_in_stock": 1
      },
      {
        "id": 14,
        "title": "Pride and Prejudice",
        "author": "Jane Austen",
        "genre": "Classic",
        "first_published": 1813,
        "number_in_stock": 1
      },
      {
        "id": 15,
        "title": "Emma",
        "author": "Jane Austen",
        "genre": "Classic",
        "first_published": 1815,
        "number_in_stock": 0
      },
      {
        "id": 16,
        "title": "The Lord of the Rings",
        "author": "J. R. R. Tolkien",
        "genre": "Fantasy",
        "first_published": 1954,
        "number_in_stock": 1
      },
      {
        "id": 17,
        "title": "The Iliad",
        "author": "Homer",
        "genre": "Epic Poem",
        "first_published": 1500,
        "number_in_stock": 3
      },
      {
        "id": 18,
        "title": "The Hobbit",
        "author": "J. R. R. Tolkien",
        "genre": "Fantasy",
        "first_published": 1937,
        "number_in_stock": 1
      }], {});
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Books', null, {});
  }
};
