module.exports = (sequelize, DataTypes) => {
    const Review = sequelize.define('Review', {
      reviewID: {
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
      comment: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: {
            args: [0, 100],
            msg: "Review comment must be at most 100 characters long"
          }
        }
      },
      rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: {
            args: 1,
            msg: "Rating must be at least 1"
          },
          max: {
            args: 5,
            msg: "Rating must be at most 5"
          }
        }
      },
      name:{
        type: DataTypes.STRING,
        allowNull: false
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    });
  
    Review.associate = function(models) {
      Review.belongsTo(models.User, { foreignKey: 'userID' });
      Review.belongsTo(models.Product, { foreignKey: 'productID' });
    };
  
    return Review;
  };  