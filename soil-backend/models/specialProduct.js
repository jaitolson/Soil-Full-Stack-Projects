module.exports = (sequelize, DataTypes) => {
    const SpecialProduct = sequelize.define('SpecialProduct', {
      specialProductID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      productID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Products',
          key: 'productID'
        }
      },
      discountPercent: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
          min: {
            args: [0],
            msg: "Discount percent must be at least 0"
          },
          max: {
            args: [100],
            msg: "Discount percent must be at most 100"
          }
        }
      },
      startDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      endDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    });
  
    SpecialProduct.associate = function(models) {
      SpecialProduct.belongsTo(models.Product, { foreignKey: 'productID' });
    };
  
    return SpecialProduct;
  };
  