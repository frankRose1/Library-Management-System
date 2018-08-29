const Patrons = require('../models').Patrons;
const Loans = require('../models').Loans;
const Books = require('../models').Books;

//patron handlers container
const patronHandlers = {};

patronHandlers.allPatrons = (req, res) => {
    Patrons.findAll()
        .then(patrons => {
            res.render('allPatrons', {title: "All Patrons", patrons});
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

//TODO: Test this out once new patrons can be added 
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

//if we encounter errors, re render the form 
    // {patron: Patrons.build(req.body)}
patronHandlers.createNewPatron = (req, res) => {
    res.sendStatus(200);
};

module.exports = patronHandlers;