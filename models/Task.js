const sequelize = require("../config/sequelize");
const Sequelize = require("sequelize");

const task = sequelize.define('task', {

  title: {
    type: Sequelize.STRING, 
    allowNull: false
  },

  description: {
    type: Sequelize.TEXT, 
    allowNull: true
  },

  dueDate: {
    type: Sequelize.DATE, 
    allowNull: true
  },

  status: {
    type: Sequelize.STRING, 
    defaultValue: 'pending'
  },

  userId: {
    type: Sequelize.STRING, 
    allowNull: false
  }
});

module.exports = task;


