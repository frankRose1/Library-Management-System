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
      allowNull: true
    },
  }, {
    timestamps: false
  });
  Books.associate = function(models) {
    //has many will place the foreign key on the target, in this case Loans
    Books.hasMany(models.Loans, {foreignKey: 'book_id', targetKey: 'id'});
  };
  return Books;
};