module.exports = (sequelize, DataTypes) => {
    const CartItem = sequelize.define('CartItem', {
      cartItemID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      userID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'userID'
        }
      },
      productID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Products',
          key: 'productID'
        }
      },
      orderID: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Orders',
          key: 'orderID'
        }
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          isInt: {
            msg: "Quantity must be an integer"
          },
          min: {
            args: [1],
            msg: "Quantity must be at least 1"
          }
        }
      },
    });
  
    CartItem.associate = function(models) {
      CartItem.belongsTo(models.User, { foreignKey: 'userID' });
      CartItem.belongsTo(models.Product, { foreignKey: 'productID' });
      CartItem.belongsTo(models.Order, { foreignKey: 'orderID' });
    };
  
    return CartItem;
  };
  