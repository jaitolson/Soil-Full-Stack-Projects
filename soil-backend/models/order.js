module.exports = (sequelize, DataTypes) => {
    const Order = sequelize.define('Order', {
      orderID: {
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
      orderDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      total: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
          isFloat: {
            msg: "Total must be a number"
          },
          min: {
            args: [0],
            msg: "Total must be a positive number"
          }
        }
      },
      shippingAddress: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Shipping address cannot be empty"
          }
        }
      },
      status: {
        type: DataTypes.STRING,
        defaultValue: 'Pending',
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    });
  
    Order.associate = function(models) {
      Order.belongsTo(models.User, { foreignKey: 'userID' });
      Order.hasMany(models.CartItem, { foreignKey: 'orderID' });
    };
  
    return Order;
  };
  