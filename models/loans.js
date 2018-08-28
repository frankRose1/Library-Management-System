'use strict';
module.exports = (sequelize, DataTypes) => {
  var Loans = sequelize.define('Loans', {
    book_id: {
      type: DataTypes.INTEGER,
      validate: {
        notEmpty: {
          msg: 'Book ID is required.'
        },
        isNumeric: {
          msg: 'Book ID must be a number.'
        }
      }
    },
    patron_id: {
      type: DataTypes.INTEGER,
      validate: {
        notEmpty: {
          msg: 'Patron ID is required.'
        },
        isNumeric: {
          msg: 'Patron ID must be a number.'
        }
      }
    },
    loaned_on: {
      type: DataTypes.DATE,
      validate: {
        notEmpty: {
          msg: '"Loaned on" field can not be blank.'
        },
        isDate: {
          msg: '"Loaned on" field must be a date.'
        }
      }
    },
    return_by: {
      type: DataTypes.DATE,
      validate: {
        notEmpty: {
          msg: '"Return by" field can not be blank.'
        },
        isDate: {
          msg: '"Return By" field must be a date(YYYY-MM-DD).'
        }
      }
    },
    returned_on: {
      type: DataTypes.DATE,
      validate: {
        notEmpty: {
          msg: '"Returned on" can not be blank.'
        },
        isDate: {
          msg: '"Returned on" field must be a date(YYYY-MM-DD).'
        }
      }
    },
  }, {
    timestamps: false
  });
  //BelongsTo associations are associations where the foreign key for the one-to-one relation exists on the source model
    //Loans is the source model, the foreign key is referring to the id's on the Books and Patrons model
  Loans.associate = function(models) {
    // associations can be defined here
    Loans.belongsTo(models.Books, {foreignKey: 'book_id', targetKey: 'id'});
    Loans.belongsTo(models.Patrons, {foreignKey: 'patron_id', targetKey: 'id'});
  };

  return Loans;
};