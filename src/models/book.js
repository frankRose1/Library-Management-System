'use strict';
module.exports = (sequelize, DataTypes) => {
  var Book = sequelize.define('Book', {
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
      allowNull: true
    },
    number_in_stock: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: {
        min: 0,
        max: 100
      }
    }
  }, {
    timestamps: false
  });
  Book.associate = function(models) {
    //has many will place the foreign key on the target, in this case Loans
    Book.hasMany(models.Loan, {foreignKey: 'book_id', targetKey: 'id'});
  };
  return Book;
};