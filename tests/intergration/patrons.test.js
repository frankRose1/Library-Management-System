const request = require('supertest');
const { initApp, tearDownApp } = require('../factory/app');
const patronFactory = require('../factory/patron');

describe('/patrons', () => {
  let server;
  let patron;

  //to be sent with a post request
  const validPatronData = {
    first_name: 'Harry',
    last_name: 'Potter',
    email: 'harry@gmail.com',
    zip_code: '34568',
    address: ' 63 Hogwarts Lane',
    library_id: 'MC4567'
  };

  const invalidPatronData = {
    first_name: 'Harry',
    email: 'harry@gmail.com',
    zip_code: '34568'
  };

  beforeEach(async () => {
    // start the server/populate the database
    server = await initApp();
    patron = await patronFactory();
  });

  afterEach(async () => {
    // close the server drop the database
    await tearDownApp(server);
  });

  describe('/all', () => {
    it('should return a list of patrons', async () => {
      const res = await request(server).get('/patrons/all');
      expect(res.status).toBe(200);
    });
  });

  describe('GET /details/:id', () => {
    it("should respond with a 404 if a patron doesn't exist", async () => {
      const res = await request(server).get(
        `/patrons/details/${patron.id + 10}`
      );
      expect(res.status).toBe(404);
      expect(res.notFound).toBe(true);
    });

    it('should respond with patron information for a valid ID', async () => {
      const res = await request(server).get(`/patrons/details/${patron.id}`);
      expect(res.status).toBe(200);
    });
  });

  describe('POST /details/:id', () => {
    it("should respond with a 404 if a patron doesn't exist", async () => {
      const res = await request(server)
        .post(`/patrons/details/${patron.id + 10}`)
        .send(validPatronData);
      expect(res.status).toBe(404);
      expect(res.notFound).toBe(true);
    });

    it('should respond with a 400 if invalid data is sent', async () => {
      const res = await request(server)
        .post(`/patrons/details/${patron.id}`)
        .send(invalidPatronData);
      expect(res.status).toBe(400);
    });

    it('should respond with a 200 for a valid ID and valid data', async () => {
      const res = await request(server)
        .post(`/patrons/details/${patron.id}`)
        .send(validPatronData);
      expect(res.status).toBe(200);
    });
  });
});
