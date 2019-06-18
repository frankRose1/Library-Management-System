const { execGet, execPost } = require('../utils/requests');
const { initApp, tearDownApp } = require('../factory/app');
const loanFactory = require('../factory/loan');
const bookFactory = require('../factory/book');
const patronFactory = require('../factory/patron');
const moment = require('moment');
const Book = require('../../src/models').Books;

describe('/loans', () => {
  jest.setTimeout(25000);

  let server;
  const todayDate = moment().format('YYYY-MM-DD');
  const weekAwayDate = moment()
    .add(1, 'week')
    .format('YYYY-MM-DD');

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
      const res = await execGet(server, '/loans/all');
      expect(res.status).toBe(200);
    });
  });

  describe('GET /new', () => {
    it('should return a 200', async () => {
      const res = await execGet(server, '/loans/new');
      expect(res.status).toBe(200);
    });
  });

  describe('POST /new', () => {
    it("should return a 404 if a user tries to take a loan out on a book that doesn't exist", async () => {
      const res = await execPost(server, '/loans/new', { book_id: 404 });
      expect(res.status).toBe(404);
      expect(res.notFound).toBe(true);
    });

    it('should return a 400 if a book is out of stock', async () => {
      const outOfStockBook = await bookFactory({ number_in_stock: 0 });
      const res = await execPost(server, '/loans/new', {
        book_id: outOfStockBook.id
      });
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
      const res = await execPost(server, '/loans/new', invalidData);
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
        loaned_on: todayDate,
        return_by: weekAwayDate
      };
      const res = await execPost(server, '/loans/new', data);
      const updatedBook = await Book.findById(book.id);
      expect(res.status).toBe(302);
      expect(updatedBook.number_in_stock).toBe(book.number_in_stock - 1);
    });
  });

  describe('GET /returns/:id', () => {
    it("should return a 404 for a loan that doesn't exist", async () => {
      const res = await execGet(server, `/loans/returns/${200}`);
      expect(res.status).toBe(404);
    });

    it('should return a 200 for a valid id', async () => {
      const loan = await loanFactory();
      const res = await execGet(server, `/loans/returns/${loan.id}`);
      expect(res.status).toBe(200);
    });
  });

  describe('POST /returns/:id', () => {
    it("should return a 404 for a loan that doesn't exist", async () => {
      const res = await execPost(server, '/loans/returns/404', {});
      expect(res.status).toBe(404);
      expect(res.notFound).toBe(true);
    });

    it('should return a 400 if a loan has already been processed', async () => {
      const loan = await loanFactory();
      loan.returned_on = todayDate;
      await loan.save();

      const res = await execPost(server, `/loans/returns/${loan.id}`, {});
      expect(res.status).toBe(400);
    });

    it('should return a 400 for invalid data', async () => {
      const loan = await loanFactory();
      const invalidData = { returned_on: '08-12-2020' };
      const res = await execPost(
        server,
        `/loans/returns/${loan.id}`,
        invalidData
      );
      expect(res.status).toBe(400);
    });

    it('should redirect and increase the book stock by one for valid data and ID', async () => {
      const initialBookStock = 3
      const loan = await loanFactory({}, {}, {number_in_stock: initialBookStock});
      const res = await execPost(server, `/loans/returns/${loan.id}`, { returned_on: weekAwayDate });
      const updatedBook = await Book.findById(loan.book_id)
      expect(res.status).toBe(302);
      expect(updatedBook.number_in_stock).toBe(initialBookStock + 1)
    });
  });
});
