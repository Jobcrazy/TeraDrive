const { DataTypes } = require("sequelize");
const sequelize = require("../common/sequelize");

const SMS = sequelize.define(
    "sms",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        content: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        timestamps: false,
        indexes: [],
    }
);

module.exports = SMS;
