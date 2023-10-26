const { DataTypes } = require("sequelize");
const sequelize = require("../util/db");

const Expense = sequelize.define(
  "Expense",
  {
    expenseInput: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    descriptionInput: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    categoryInput: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {}
);

module.exports = Expense;
