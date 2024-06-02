const argon2 = require('argon2');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    userID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    bio: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
    },
    role: {
      type: DataTypes.STRING,
      defaultValue: 'user',
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    userBlock: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  }, {
    hooks: {
      beforeCreate: async (user) => {
        user.password = await argon2.hash(user.password);
      },
      beforeUpdate: async (user) => {
        if (user.changed('password')) {
          user.password = await argon2.hash(user.password);
        }
      }
    }
  });

  User.associate = function(models) {
    User.hasMany(models.Review, { foreignKey: 'userID' });
    User.hasMany(models.Order, { foreignKey: 'userID' });
    User.hasMany(models.CartItem, { foreignKey: 'userID' });
    
    User.belongsToMany(User, {
      as: 'Followers',
      through: models.UserFollow,
      foreignKey: 'followingID',
    });
    
    User.belongsToMany(User, {
      as: 'Following',
      through: models.UserFollow,
      foreignKey: 'followerID',
    });
  };

  return User;
};
