const request = require('supertest');
const { initApp, tearDownApp } = require('../factory/app');
const bookFactory = require('../factory/book');

xdescribe('/books', () => {
  let server;
  let book;

  const validBookData = {
    title: 'Lord of the Rings',
    author: 'J.R.R. Tolkien',
    year_published: 1934,
    number_in_stock: 1,
    genre: 'Fiction'
  };

  const invalidBookData = {
    number_in_stock: 101,
    year_published: 2056
  };

  beforeEach(async () => {
    //start the server populate the DB
    server = await initApp();
    book = await bookFactory();
  });

  afterEach(async () => {
    // tear down the DB and close the server
    server = await tearDownApp(server);
  });

  describe('GET /all', () => {
    it('should return a 200 and a list of books', async () => {
      const res = await request(server).get('/books/all');
      expect(res.status).toBe(200);
    });
  });

  describe('GET /details/:id', () => {
    it('should return a 404 if a book doesnt exist', async () => {
      const res = await request(server).get(`/books/details/${book.id + 20}`);
      expect(res.status).toBe(404);
      expect(res.notFound).toBe(true);
    });

    it('should return a 200 for a valid ID', async () => {
      const res = await request(server).get(`/books/details/${book.id}`);
      expect(res.status).toBe(200);
    });
  });

  describe('POST /details/:id', () => {
    it('should return a 404 if a book doesnt exist', async () => {
      const res = await request(server).get(`/books/details/${book.id + 20}`);
      expect(res.status).toBe(404);
      expect(res.notFound).toBe(true);
    });

    it('should return a 400 for invalid data', async () => {
      const res = await request(server)
        .post(`/books/details/${book.id}`)
        .send(invalidBookData);
      expect(res.status).toBe(400);
    });

    it('should redirect and respond with a 302 for valid input and ID', async () => {
      const res = await request(server)
        .post(`/books/details/${book.id}`)
        .send(validBookData);
      expect(res.status).toBe(302);
    });
  });

  describe('POST /search', () => {
    it('should return a 200 for a valid search query', async () => {
      const res = await request(server)
        .post('/books/search')
        .send({ search_query: book.title });
      expect(res.status).toBe(200);
    });
  });
});
