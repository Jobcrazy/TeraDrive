const { DataTypes } = require("sequelize");
const sequelize = require("../common/sequelize");

const Progress = sequelize.define(
    "progress",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
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

module.exports = Progress;