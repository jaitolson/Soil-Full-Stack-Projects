// models/userFollow.js
module.exports = (sequelize, DataTypes) => {
    const UserFollow = sequelize.define('UserFollow', {
      followerID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'userID'
        }
      },
      followingID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'userID'
        }
      }
    });
  
    return UserFollow;
  };
  