const request = require('supertest');
const { initApp, tearDownApp } = require('../factory/app');
const loanFactory = require('../factory/loan');
const bookFactory = require('../factory/book');
const patronFactory = require('../factory/patron');
const moment = require('moment');
const Book = require('../../src/models').Books;

describe('/loans', () => {
  let server;

  beforeEach(async () => {
    //start the server populate the DB
    server = await initApp();
  });

  afterEach(async () => {
    // tear down the DB and close the server
    server = await tearDownApp(server);
  });

  describe('GET /all', () => {
    it('should return a 200', async () => {
      const res = await request(server).get('/loans/all');
      expect(res.status).toBe(200);
    });
  });

  describe('GET /new', () => {
    it('should return a 200', async () => {
      const res = await request(server).get('/loans/new');
      expect(res.status).toBe(200);
    });
  });

  describe('POST /new', () => {
    it("should return a 404 if a user tries to take a loan out on a book that doesn't exist", async () => {
      const res = await request(server)
        .post('/loans/new')
        .send({ book_id: 404 });
      expect(res.status).toBe(404);
      expect(res.notFound).toBe(true);
    });

    it('should return a 400 if a book is out of stock', async () => {
      const outOfStockBook = await bookFactory({ number_in_stock: 0 });
      const res = await request(server)
        .post('/loans/new')
        .send({ book_id: outOfStockBook.id });
      expect(res.status).toBe(400);
    });

    it('should return a 400 for invalid data', async () => {
      const book = await bookFactory();
      const invalidData = {
        book_id: book.id,
        patron_id: 0,
        loaned_on: '08-15-2017',
        return_by: '2017-08-21'
      };
      const res = await request(server)
        .post('/loans/new')
        .send(invalidData);
      expect(res.status).toBe(400);
    });

    it('should redirect on success and decrease the book stock by 1', async () => {
      const [book, patron] = await Promise.all([
        bookFactory({ number_in_stock: 2 }),
        patronFactory()
      ]);
      const data = {
        book_id: book.id,
        patron_id: patron.id,
        loaned_on: moment().format('YYYY-MM-DD'),
        return_by: moment()
          .add(1, 'week')
          .format('YYYY-MM-DD')
      };
      const res = await request(server)
        .post('/loans/new')
        .send(data);
      const updatedBook = await Book.findById(book.id);
      expect(res.status).toBe(302);
      expect(updatedBook.number_in_stock).toBe(book.number_in_stock - 1);
    });
  });

  describe('GET /returns/:id', async () => {
    it('should return a 404 for a loan that doesn\'t exist', () => {
      const res = await request.get(`/loans/returns/${200}`)
      expect(res.status).toBe(404)
    })
  })
});
