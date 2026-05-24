const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');

const Identity = sequelize.define('Identity', {
  secretKey: {
    type:      DataTypes.STRING(20),
    allowNull: false,
    unique:    true
  },
  lastSeen: {
    type:         DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
});

module.exports = Identity;