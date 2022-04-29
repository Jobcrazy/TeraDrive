const { DataTypes } = require("sequelize");
const sequelize = require("../common/sequelize");

const File = sequelize.define(
    "file",
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
        path: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        md5: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        timestamps: false,
        indexes: [{ fields: ["md5"], unique: true }],
    }
);

module.exports = File;
