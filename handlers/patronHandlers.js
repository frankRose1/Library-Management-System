const Patrons = require('../models').Patrons;
const Loans = require('../models').Loans;
const Books = require('../models').Books;
const { Op } = require('sequelize');
const createError = require('../utils/createError');

const patronHandlers = {};

patronHandlers.allPatrons = async (req, res) => {
  const page = req.params.page || 1;
  const limit = 5;
  const offset = page * limit - limit;
  const patrons = await Patrons.findAndCountAll({
    offset: offset,
    limit: limit
  });
  const count = patrons.count;
  const pages = Math.ceil(count / limit);

  //if the user tries to access a page that will exceed the number of items in the DB, redirect them to the highest possible page
  //the length would be falsey and a skip value would have to be present
  if (!patrons.rows.length && offset) {
    return res.redirect(`/patrons/all/page/${pages}`);
  }

  res.render('allPatrons', {
    title: 'All Patrons',
    patrons: patrons.rows,
    page,
    pages,
    count
  });
};

patronHandlers.patronDetails = async (req, res) => {
  const { id } = req.params;
  const patron = await Patrons.findOne({
    where: {
      id: id
    },
    include: [
      {
        model: Loans,
        include: [Books]
      }
    ]
  });

  if (!patron) {
    createError('Patron not found.', 404);
  }

  const title = `${patron.first_name} ${patron.last_name}`;
  res.render('patronDetails', { title, patron });
};

patronHandlers.updatePatron = (req, res, next) => {
  const { id } = req.params;
  Patrons.findById(id)
    .then(patron => {
      if (patron) {
        return patron.update(req.body);
      } else {
        const error = new Error('Patron not found');
        error.status = 404;
        return next(error);
      }
    })
    .then(patron => {
      res.redirect('/patrons/all');
    })
    .catch(err => {
      if (err.name == 'SequelizeValidationError') {
        Patrons.findOne({
          where: {
            id: id
          },
          include: [
            {
              model: Loans,
              include: [Books]
            }
          ]
        })
          .then(patron => {
            if (patron) {
              res.render('patronDetails', {
                title: `${patron.first_name} ${patron.last_name}`,
                patron,
                errors: err.errors
              });
            } else {
              const error = new Error('Patron not found');
              error.status = 404;
              return next(error);
            }
          })
          .catch(err => {
            return next(err);
          });
      } else {
        throw err;
      }
    })
    .catch(err => {
      next(err);
    });
};

patronHandlers.newPatronForm = (req, res) => {
  res.render('newPatronForm', { title: 'New Patron', patron: {} });
};

patronHandlers.createNewPatron = (req, res, next) => {
  Patrons.create(req.body)
    .then(patron => {
      //on a successful create, redirect to patrons/all
      res.redirect('/patrons/all');
    })
    .catch(err => {
      if (err.name == 'SequelizeValidationError') {
        //re render the form with validation errors
        res.render('newPatronForm', {
          title: 'New Patron',
          patron: Patrons.build(req.body),
          errors: err.errors
        });
      } else {
        throw err;
      }
    })
    .catch(err => {
      next(err);
    });
};

//Allow users to search by a patrons library_id or email. search is case insensitive
patronHandlers.searchPatrons = async (req, res) => {
  const { search_query } = req.body;
  const patrons = await Patrons.findAll({
    where: {
      [Op.or]: [
        {
          library_id: {
            [Op.like]: `%${search_query}%`
          }
        },
        {
          email: {
            [Op.like]: `%${search_query}%`
          }
        }
      ]
    }
  });
  res.render('allPatrons', { title: 'Patrons', patrons, search_query });
};

module.exports = patronHandlers;
