const Patron = require('../models').Patrons;

//patron handlers container
const patronHandlers = {};

// on post requests instead of sending a 500 all the time, it may be that a required field was not filled out
//send back an error PUG and the form, along with the error message we set up in the model

//TODO send back id for link to individual patron page
patronHandlers.allPatrons = (req, res) => {
    Patron.findAll({
        attributes: [
            'first_name',
            'last_name',
            'address',
            'email',
            'library_id',
            'zip_code',
            'id'
        ]
    })
    .then(patrons => {
        res.render('allPatrons', {title: "All Patrons", patrons});
    })
    .catch(err => {
        res.sendStatus(500);
    });
};

// patronHandlers.patronDetails = (req, res) => {
//     Patron.findAll({
//         attributes: {exclude : ['createdAt', 'updatedAt']}
//     })
//         .then(patrons => {
//             res.json(patrons);
//         })
//         .catch(err => {
//             console.error(err);
//             res.send(500);
//         });
// };

module.exports = patronHandlers;