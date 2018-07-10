import bcrypt from 'bcryptjs';

export default (sequelize, DataTypes) => {
  const User = sequelize.define(
    'user',
    {
      username: {
        type: DataTypes.STRING,
        unique: true,
        validate: {
          isAlphanumeric: {
            args: true,
            msg: 'Can only contain numbers and letters'
          },
          len: {
            args: [3, 25],
            msg: 'Only between 3 and 25 characters'
          }
        }
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        validate: {
          isEmail: {
            args: true,
            msg: 'Not a valid email address'
          }
        }
      },
      password: {
        type: DataTypes.STRING,
        validate: {
          len: {
            args: [6, 40],
            msg: 'Password must be 6-40 characters'
          }
        }
      }
    },
    {
      hooks: {
        afterValidate: async user => {
          const hashedPassword = await bcrypt.hash(user.password, 10);
          user.password = hashedPassword;
        }
      }
    }
  );

  User.associate = models => {
    User.belongsToMany(models.Team, {
      through: 'member',
      foreignKey: {
        name: 'userId',
        field: 'user_id'
      }
    });
    // M:M
    User.belongsToMany(models.Channel, {
      through: 'channel_member',
      foreignKey: {
        name: 'userId',
        field: 'user_id'
      }
    });
  };

  return User;
};
