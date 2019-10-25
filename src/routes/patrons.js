const { Router } = require('express');
const router = Router();
const { Patron, Loan, Book } = require('../models');
const { Op } = require('sequelize');
const createError = require('../utils/createError');
const { validatePatron } = require('../utils/validation');


async function fetchPatrons(req, res) {
  const page = req.params.page || 1;
  const limit = 5;
  const offset = page * limit - limit;
  const patrons = await Patron.findAndCountAll({
    offset: offset,
    limit: limit
  });
  const count = patrons.count;
  const pages = Math.ceil(count / limit);

  // if the user tries to access a page that will exceed the number of items in the DB,
  // redirect them to the highest possible page
  // the length would be falsey and a skip value would have to be present
  if (!patrons.rows.length && offset) {
    return res.redirect(`/patrons/page/${pages}`);
  }

  res.render('patronList', {
    title: 'All Patrons',
    patrons: patrons.rows,
    page,
    pages,
    count
  });
}

router.get('/', fetchPatrons);

router.get('/page/:page', fetchPatrons); //for pagination

router.get('/new', (req, res) => {
  res.render('newPatronForm', { title: 'New Patron', patron: {} });
});

router.post('/new', async (req, res) => {
  const { error, value } = validatePatron(req.body);

  if (error) {
    return res.status(400).render('newPatronForm', {
      title: 'New Patron',
      patron: Patron.build(req.body),
      errors: error.details
    });
  }

  await Patron.create(value);

  res.status(201).redirect('/patrons/all');
});

router.get('/detail/:id', async (req, res) => {
  const { id } = req.params;

  const patron = await Patron.findOne({
    where: {
      id: id
    },
    include: [
      {
        model: Loan,
        include: [Book]
      }
    ]
  });

  if (!patron) {
    createError('Patron not found.', 404);
  }

  const title = `${patron.first_name} ${patron.last_name}`;

  res.render('patronDetail', { title, patron });
});

router.post('/detail/:id', async (req, res) => {
  const { id } = req.params;

  const patron = await Patron.findOne({
    where: {
      id: id
    },
    include: [
      {
        model: Loan,
        include: [Book]
      }
    ]
  });

  if (!patron) {
    createError('Patron not found.', 404);
  }

  const { error, value } = validatePatron(req.body);

  if (error) {
    return res.status(400).render('patronDetail', {
      title: `${patron.first_name} ${patron.last_name}`,
      patron,
      errors: error.details
    });
  }

  await patron.update(value);

  res.redirect('/patrons');
});

//users can search by a patrons library_id or email. search is case insensitive
router.post('/search', async (req, res) => {
  const { search_query } = req.body;

  const patrons = await Patron.findAll({
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

  res.render('patronList', { title: 'Patrons', patrons, search_query });
});

module.exports = router;
