const Patron = require('../models').Patrons;

//patron handlers container
const patronHandlers = {};

// n post requests instead of sending a 500 all the time, it may be that a required field was not filled out
//send back an error PUG and the form, along with the error message we set up in the model
patronHandlers.patronDetails = (req, res) => {
    Patron.findAll({
        attributes: {exclude : ['createdAt', 'updatedAt']}
    })
        .then(patrons => {
            res.json(patrons);
        })
        .catch(err => {
            console.error(err);
            res.send(500);
        });
};

module.exports = patronHandlers;