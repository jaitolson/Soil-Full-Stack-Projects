// models/product.js
module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define('Product', {
    productID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Product name cannot be empty"
        }
      }
    },
    description: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: "Product description cannot be empty"
        }
      }
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        isFloat: {
          msg: "Price must be a number"
        },
        min: {
          args: [0],
          msg: "Price must be a positive number"
        }
      }
    },
    imagePath: {
      type: DataTypes.STRING,
    },
  });

  Product.associate = function(models) {
    Product.belongsToMany(models.Category, {
      through: 'ProductCategory',
      foreignKey: 'productID',
    });
  };

  return Product;
};
