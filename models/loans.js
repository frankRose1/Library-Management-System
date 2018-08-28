'use strict';
module.exports = (sequelize, DataTypes) => {
  var Loans = sequelize.define('Loans', {
    book_id: DataTypes.INTEGER,
    patron_id: DataTypes.INTEGER,
    loaned_on: DataTypes.DATE,
    return_by: DataTypes.DATE,
    returned_on: DataTypes.DATE
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