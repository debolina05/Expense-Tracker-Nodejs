
const {Sequelize} = require('sequelize');

const sequelize = new Sequelize('expense-full-stack', 'root', 'root123', {
    host: 'localhost',
    dialect: 'mysql' 
  });

module.exports=sequelize;