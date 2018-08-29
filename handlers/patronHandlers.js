const Patrons = require('../models').Patrons;
const Loans = require('../models').Loans;
const Books = require('../models').Books;

//patron handlers container
const patronHandlers = {};

//TODO: send back id for link to individual patron page
patronHandlers.allPatrons = (req, res) => {
    Patrons.findAll()
        .then(patrons => {
            res.render('allPatrons', {title: "All Patrons", patrons});
        }).catch(err => {
            res.sendStatus(500);
        });
};

//find the patron by ID
//include the loan history for this patron
patronHandlers.patronDetails = (req, res) => {
    const {id} = req.params;
    Patrons.findOne({
        where : {
            id: id
        },
        //include the loans with their books
        include: [
            {
                model: Loans,
                include: [Books]
            }
        ]
    }).then(patron => {
        if (patron) {
            console.log(patron);
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
    console.log(req.params);
    res.sendStatus(200);
};

module.exports = patronHandlers;