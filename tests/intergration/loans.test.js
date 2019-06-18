const request = require('supertest');
const { initApp, tearDownApp } = require('../factory/app');
const loanFactory = require('../factory/loan');

describe('/loans', () => {
  let server;
  let loan;

  // beforeEach(async () => {
  //   //start the server populate the DB
  //   server = await initApp();
  //   loan = await loanFactory();
  // });

  // afterEach(async () => {
  //   // tear down the DB and close the server
  //   server = await tearDownApp(server);
  // });
});
