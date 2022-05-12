const { DataTypes } = require("sequelize");
const sequelize = require("../common/sequelize");

const Client = sequelize.define(
    "client",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        firstname: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        lastname: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        company: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        postal: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        address: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        drop: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        timestamps: false,
        indexes: [
            { fields: ["email"], unique: true },
            { fields: ["phone"], unique: true },
        ],
    }
);

module.exports = Client;
