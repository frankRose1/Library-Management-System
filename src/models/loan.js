'use strict';
module.exports = (sequelize, DataTypes) => {
  var Loan = sequelize.define('Loan', {
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
      type: DataTypes.DATEONLY,
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
      type: DataTypes.DATEONLY,
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
      type: DataTypes.DATEONLY,
      validate: {
        notEmpty: {
          msg: '"Returned on" can\t be blank.'
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
  Loan.associate = function(models) {
    // associations can be defined here
    Loan.belongsTo(models.Book, {foreignKey: 'book_id', targetKey: 'id'});
    Loan.belongsTo(models.Patron, {foreignKey: 'patron_id', targetKey: 'id'});
  };

  return Loan;
};