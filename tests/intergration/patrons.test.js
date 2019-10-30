const { execGet, execPost } = require('../utils/requests');
const { initApp, tearDownApp } = require('../factory/app');
const patronFactory = require('../factory/patron');

describe('/patrons', () => {
  jest.setTimeout(25000);

  let server;
  let patron;

  const validPatronData = {
    first_name: 'Harry',
    last_name: 'Potter',
    email: 'harry@gmail.com',
    zip_code: '34568',
    address: ' 63 Hogwarts Lane',
    library_id: 'MC45671'
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
    server = await tearDownApp(server);
  });

  describe('GET /', () => {
    it('should return a list of patrons', async () => {
      const res = await execGet(server, '/patrons');
      expect(res.status).toBe(200);
    });
  });

  describe('GET /new', () => {
    it('should return a 200 and the new patron form', async () => {
      const res = await execGet(server, '/patrons/new');
      expect(res.status).toBe(200);
    });
  });

  describe('GET /detail/:id', () => {
    it("should respond with a 404 if a patron doesn't exist", async () => {
      const res = await execGet(server, `/patrons/detail/${patron.id + 20}`);
      expect(res.status).toBe(404);
      expect(res.notFound).toBe(true);
    });

    it('should respond with patron information for a valid ID', async () => {
      const res = await execGet(server, `/patrons/detail/${patron.id}`);
      expect(res.status).toBe(200);
    });
  });

  describe('POST /detail/:id', () => {
    it("should respond with a 404 if a patron doesn't exist", async () => {
      const res = await execPost(
        server,
        `/patrons/detail/${patron.id + 20}`,
        {}
      );
      expect(res.status).toBe(404);
      expect(res.notFound).toBe(true);
    });

    it('should respond with a 400 if invalid data is sent', async () => {
      const res = await execPost(
        server,
        `/patrons/detail/${patron.id}`,
        invalidPatronData
      );
      expect(res.status).toBe(400);
    });

    it('should redirect and respond with a 302 for a valid ID and valid data', async () => {
      const res = await execPost(
        server,
        `/patrons/detail/${patron.id}`,
        validPatronData
      );
      expect(res.status).toBe(302);
    });
  });

  describe('GET /search', () => {
    it('should return a 200 for a valid search query', async () => {
      const res = await execGet(
        server,
        `/patrons/search?search_query=${patron.library_id}`
      );
      expect(res.status).toBe(200);
    });
  });
});
