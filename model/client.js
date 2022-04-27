const { DataTypes } = require('sequelize');
const sequelize = require('../common/sequelize');

const Client = sequelize.define("client", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    company: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    firstname: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    lastname: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    address: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    postal: {
        type: DataTypes.STRING,
        allowNull: false,
    },

}, {
    timestamps: false
});

module.exports = Client;