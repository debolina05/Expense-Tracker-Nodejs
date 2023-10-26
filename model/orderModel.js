const { DataTypes } = require("sequelize");
const sequelize = require("../util/db");

const Order = sequelize.define(
  "order",
  {
    order_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    payment_id: {
      type: DataTypes.STRING,
    },
    payment_sign: {
      type: DataTypes.STRING,
    },
    payment_status: DataTypes.STRING,
  },
  {}
);

module.exports = Order;
