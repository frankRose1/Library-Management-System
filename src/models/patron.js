'use strict';
module.exports = (sequelize, DataTypes) => {
  var Patron = sequelize.define('Patron', {
    first_name: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: 'First name is required.'
        }
      }
    },
    last_name: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: 'Last name is required.'
        }
      }
    },
    address: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: 'Address is required.'
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: 'Email is required.'
        },
        isEmail: {
          msg: 'Invalid Email'
        }
      }
    },
    zip_code: {
      type: DataTypes.INTEGER,
      validate: {
        notEmpty: {
          msg: 'Zip-code is required.'
        },
        isNumeric: {
          msg: 'Zip Code must be a number.'
        }
      }
    },
    library_id:{ 
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: 'Library id is required.'
        }
      }
    }
  }, {
    timestamps: false
  });

  Patron.associate = function(models) {
    Patron.hasMany(models.Loan, {foreignKey: 'patron_id', targetKey: 'id'});
  };
  
  return Patron;
};