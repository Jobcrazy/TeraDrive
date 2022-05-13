const { DataTypes } = require("sequelize");
const sequelize = require("../common/sequelize");

const Status = sequelize.define(
    "status",
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

module.exports = Status;