'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Loans', [
      {
        "id": 1,
        "book_id": 15,
        "patron_id": 2,
        "loaned_on": "2015-12-10",
        "return_by": "2020-10-20",
        "returned_on": null
      },
      {
        "id": 2,
        "book_id": 4,
        "patron_id": 1,
        "loaned_on": "2015-12-11",
        "return_by": "2015-12-18",
        "returned_on": null
      },
      {
        "id": 3,
        "book_id": 8,
        "patron_id": 1,
        "loaned_on": "2015-12-12",
        "return_by": "2015-12-19",
        "returned_on": null
      },
      {
        "id": 4,
        "book_id": 9,
        "patron_id": 3,
        "loaned_on": "2015-12-13",
        "return_by": "2015-12-20",
        "returned_on": null
      },
      {
        "id": 5,
        "book_id": 11,
        "patron_id": 4,
        "loaned_on": "2015-12-13",
        "return_by": "2015-12-20",
        "returned_on": "2015-12-17"
      },
      {
        "id": 7,
        "book_id": 17,
        "patron_id": 4,
        "loaned_on": "2018-08-31",
        "return_by": "2018-09-07",
        "returned_on": null
      },
      {
        "id": 8,
        "book_id": 16,
        "patron_id": 6,
        "loaned_on": "2018-09-03",
        "return_by": "2018-09-10",
        "returned_on": "2018-09-03"
      },
      {
        "id": 9,
        "book_id": 18,
        "patron_id": 6,
        "loaned_on": "2018-09-03",
        "return_by": "2018-09-10",
        "returned_on": "2018-09-23"
      },
      {
        "id": 12,
        "book_id": 16,
        "patron_id": 5,
        "loaned_on": "2019-02-02",
        "return_by": "2019-02-09",
        "returned_on": "2019-02-02"
      }], {});
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Loans', null, {});
  }
};
