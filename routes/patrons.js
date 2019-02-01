const express = require('express')
const router = express.Router()
const Patrons = require('../models').Patrons;
const Loans = require('../models').Loans;
const Books = require('../models').Books;
const { Op } = require('sequelize');
const createError = require('../utils/createError');
const { validatePatron } = require('../validation')

/**
 * All routes are prefixed with "/patrons"
 */

async function fetchPatrons(req, res){
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
}

router.get('/all', fetchPatrons);

router.get('/all/page/:page', fetchPatrons); //for pagination

router.get('/new', (req, res) => {
  res.render('newPatronForm', { title: 'New Patron', patron: {} });
});

router.post('/new', async (req, res ) => {
  const { error, value } = validatePatron(req.body);

  if (error) {
    return res
      .status(400)
      .render('newPatronForm', {
      title: 'New Patron',
      patron: Patrons.build(req.body),
      errors: error.details
    });
  }

  await Patrons.create(value);
  res.status(201).redirect('/patrons/all');
});

router.get('/details/:id', async (req, res) => {
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
});

router.post('/details/:id', async (req, res) => {
  const { id } = req.params;

  const patron = await Patrons.findOne({
    where: {
      id: id
    },
    include: [
      {
        model: Loans,
        include: [ Books ]
      }
    ]
  });

  if (!patron) {
    createError('Patron not found.', 404)
  }

  const {error, value} = validatePatron(req.body)

  if (error){
    return res.render('patronDetails', {
      title: `${patron.first_name} ${patron.last_name}`,
      patron,
      errors: error.details
    });
  }
  
  await patron.update(value)

  res.status(200).redirect('/patrons/all');
});

//users can search by a patrons library_id or email. search is case insensitive
router.post('/search', async (req, res) => {
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
});


module.exports = router;