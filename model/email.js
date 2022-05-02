const { DataTypes } = require("sequelize");
const sequelize = require("../common/sequelize");

const Email = sequelize.define(
    "email",
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
            type: DataTypes.TEXT,
            allowNull: false,
        },
    },
    {
        timestamps: false,
        indexes: [],
    }
);

module.exports = Email;
