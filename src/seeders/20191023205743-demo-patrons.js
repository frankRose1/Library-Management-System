'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
   return queryInterface.bulkInsert('Patrons', [
    {
      "id": 1,
      "first_name": "Andrew",
      "last_name": "Chalkley",
      "address": "1234 NE 20st St",
      "email": "andrew.chalkley@teamtreehouse.com",
      "zip_code": 90210,
      "library_id": "MCL1001"
    },
    {
      "id": 2,
      "first_name": "Dave",
      "last_name": "McFarland",
      "address": "5252 NW 2nd St",
      "email": "dave.mcfarland@teamtreehouse.com",
      "zip_code": 90210,
      "library_id": "MCL1010"
    },
    {
      "id": 3,
      "first_name": "Alena",
      "last_name": "Holligan",
      "address": "1404 SW 101st St",
      "email": "alena.holligan@teamtreehouse.com",
      "zip_code": 91210,
      "library_id": "MCL1100"
    },
    {
      "id": 4,
      "first_name": "Michael",
      "last_name": "Poley",
      "address": "7070 NE 10th Ave",
      "email": "michael.poley@teamtreehouse.com",
      "zip_code": 91310,
      "library_id": "MCL1011"
    },
    {
      "id": 5,
      "first_name": "John",
      "last_name": "Smith",
      "address": "123 Fake St",
      "email": "johnS75@gmail.com",
      "zip_code": 20356,
      "library_id": "MCL1020"
    },
    {
      "id": 6,
      "first_name": "Jane",
      "last_name": "Smith",
      "address": "45 Sesame Street",
      "email": "jane.smith@aol.com",
      "zip_code": 10215,
      "library_id": "MCL3020"
    }], {});
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Patrons', null, {});
  }
};
