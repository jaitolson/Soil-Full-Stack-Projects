// models/category.js
module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define('Category', {
    categoryID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  Category.associate = function(models) {
    Category.belongsToMany(models.Product, {
      through: 'ProductCategory',
      foreignKey: 'categoryID',
    });
  };

  return Category;
};