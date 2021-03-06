# Library Managment System with Node.js & Sequelize

A library management system for a small library. The goal of this project was to create a more intuitive way of handling the library's books, patrons, and loans. Node, Express, Pug, and the SQL ORM Sequelize are used to create a dynamic website that properly shows the associations between books, patrons and loans. Also includes integration tests, server side validation with Joi, pagination, and a search feature!

## Getting Started

clone/download this repo and follow these steps:

1. rename `example.env` to `.env` and change variables if necessary
2. Build the services in docker-compose.yml:
   - `docker-compose build`
3. Install project dependencies:
   - `docker-compose run --rm web npm install`
4. Create dev database, run migrations, and seed the database:
   - `docker-compose run --rm web npm run init`
5. Start the containers:
   - `docker-compose up`
6. Visit http://localhost:8000/ to view the application
   - if running docker in a VM swap "localhost" VM IP address

## Run Tests

1. Create the test database:
   - `docker-compose run --rm -e NODE_ENV=test web npx sequelize-cli db:create`
2. Use jest to run the test suite:
   - `docker-compose run --rm npm run test`

## App Features

### Model Relationships

- Books and Patrons can have many different Loan relationships at a time
- Loans belong to the Patron and Book models and are linked by the `book_id` and `patron_id`

### Patrons

- `/patrons` will get a list of patrons
  - pagination is used to make the returned data more managable
- Each patron has a details page, where their information can be updated and loan can history is viewed
- New patrons can be created and added to the DB
- Sequelize Validation will catch any required fields that are missing or invalid on creation/updates
- Patrons can be searched by `library_id` or `email`

### Loans

- Loans can be filtered by their status, either `overdue` or `checked out`
- New loans can be created
  - all books and patrons are provided in a select menus
  - `return_by` date is pre-populated 7 days from the day of the loan
- Sequelize Validation will catch any required fields that are missing or invalid
- When a loaned book is returned the `returned_on` date is pre-populated in the form
  - A returned loan will immediately be reflected in the patron's and book's loan history

### Books

- `/books` will get a list of books
  - pagination is used to make the returned data more managable
- Each book has a details page, where the information can be updated and loan can history is viewed
- New books can be created and added to the DB
- Sequelize Validation will catch any required fields that are missing or invalid on creation/updates
- Books can be filtered by their status, either `overdue` or `checked out`
- Books can be searched by `title` or `author`
- Book inventory will be decremented when a loan is taken out and incremented when the book is returned

## Technologies Used

- node
- express
- pug
- sequelize
- sequelize-cli
- pg
- @hapi/joi
- @hapi/joi-date
- moment
- jest
- supertest
- faker
