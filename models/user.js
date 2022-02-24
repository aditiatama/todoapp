'use strict';
const {
  Model
} = require('sequelize');
const { hash } = require('../helpers/hash-helper');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Todo, { foreignKey: 'UserId' });
    }
  };
  User.init({
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: {
          msg: 'Wrong email format'
        },
        notNull: {
          msg: `Email can't be empty`
        },
        notEmpty: {
          msg: `Email can't be empty`
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: `Password can't be empty`
        },
        notEmpty: {
          msg: `Password can't be empty`
        },
        moreThanFiveCharacters(value) {
          if (value.length < 8) {
            throw new Error('Password cannot be less than eight characters');
          }
        }
      }
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: `Username can't be empty`
        },
        notEmpty: {
          msg: `Username can't be empty`
        }
      }
    },
  }, {
    hooks: {
      beforeCreate: (instance, options) => {
        instance.password = hash(instance.password);
      }
    },
    sequelize,
    modelName: 'User',
  });
  return User;
};