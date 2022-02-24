'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Todo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Todo.belongsTo(models.User, { foreignKey: 'UserId' });
    }
  };
  Todo.init({
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: `Title can't be empty`
        },
        notEmpty: {
          msg: `Title can't be empty`
        }
      }
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: `Description can't be empty`
        },
        notEmpty: {
          msg: `Description can't be empty`
        }
      }
    },
    UserId: {
      type: DataTypes.INTEGER,
    },
    due_date: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        notNull: {
          msg: `Due date can't be empty`
        },
        notEmpty: {
          msg: `Due date can't be empty`
        },
        // isAfter: new Date(),
      }
    },
  }, {
    sequelize,
    modelName: 'Todo',
  });
  return Todo;
};