'use strict';
module.exports = (sequelize, DataTypes) => {
  var Books = sequelize.define('Books', {
    title: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: 'Book title is required.'
        }
      }
    },
    author: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: 'Author is required.'
        }
      }
    },
    genre:{ 
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: 'Genre is required.'
        }
      }
    },
    first_published: {
      type: DataTypes.INTEGER,
      validate: {
        isNumeric: {
          msg: "Please provide a number date (e.g.) 2005"
        }
      }
    },
  }, {
    timestamps: false
  });
  Books.associate = function(models) {
    // associations can be defined here
  };
  return Books;
};