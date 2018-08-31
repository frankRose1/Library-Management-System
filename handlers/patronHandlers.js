const Patrons = require('../models').Patrons;
const Loans = require('../models').Loans;
const Books = require('../models').Books;

const patronHandlers = {};

patronHandlers.allPatrons = (req, res) => {
    const page = req.params.page || 1;
    const limit = 5;
    const offset = (page * limit) - limit;

    Patrons.findAndCountAll({
        offset: offset,
        limit: limit
    }).then(patrons => {
        const count = patrons.count;
        const pages = Math.ceil(count / limit);
        //if the user tries to access a page that will exceed the number of items in the DB, redirect them to the highest possible page
            //the length would be falsey and a skip value would have to be present
        if (!patrons.rows.length && offset) {
            res.redirect(`/patrons/all/page/${pages}`);
            return;
        }

        res.render('allPatrons', {
                                    title: "All Patrons", 
                                    patrons: patrons.rows,
                                    page,
                                    pages,
                                    count
                                });
    }).catch(err => {
        res.sendStatus(500);
    });
};

//include the loan history of each patron
patronHandlers.patronDetails = (req, res) => {
    const {id} = req.params;
    Patrons.findOne({
        where : {
            id: id
        },
        include: [{
                model: Loans,
                include: [Books]
            }]
    }).then(patron => {
        if (patron) {
            const title = `${patron.first_name} ${patron.last_name}`;
            res.render('patronDetails', {title , patron});
        } else {
            res.sendStatus(404);
        }
    }).catch(err => {
        res.sendStatus(500);
    });
};


patronHandlers.updatePatron = (req, res) => {
    const {id} = req.params;
    Patrons.findById(id)
        .then(patron => {
            if (patron) {
                return patron.update(req.body);
            } else {
                //patron not found
                res.sendStatus(404);
            }
        }).catch(err => {
            if (err.name == 'SequelizeValidationError') {
                Patrons.findOne({
                    where: {
                        id: id
                    },
                    include: [{
                            model: Loans,
                            include: [Books]
                        }]
                }).then(patron => {
                    if (patron) {
                        res.render('patronDetails', {
                            title: `${patron.first_name} ${patron.last_name}`,
                            patron,
                            errors: err.errors
                        });
                    } else {
                        res.sendStatus(404);
                    }
                }).catch(err => {
                    res.sendStatus(500);
                });
            } else {
                throw err;
            }
        }).catch(err => {
            res.sendStatus(500);
        });
};

patronHandlers.newPatronForm = (req, res) => {
    res.render('newPatronForm', {title: 'New Patron', patron: {}});
};


patronHandlers.createNewPatron = (req, res) => {
    Patrons.create(req.body)
        .then(patron => {
            //on a successful create, redirect to patrons/all
            res.redirect('/patrons/all');
        }).catch(err => {
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
        }).catch(err => {
            res.sendStatus(500);
        });
};

module.exports = patronHandlers;