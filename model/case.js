const { DataTypes } = require("sequelize");
const sequelize = require("../common/sequelize");

const Case = sequelize.define(
    "case",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        drop: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        status: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        progress: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        notes: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        type: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: "",
        },
        todo: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: "",
        },
        malfunction: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: "",
        },
        quote: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            defaultValue: 0,
        },
        paid: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            defaultValue: 0,
        },
        open: {
            // OK to open
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        format: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: "",
        },
        target: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: "",
        },
        referer: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: "",
        },
        received: {
            // Approved on
            type: DataTypes.DATEONLY,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
        approved: {
            // Approved on
            type: DataTypes.DATEONLY,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
        files: {
            type: DataTypes.TEXT,
            allowNull: false,
            defaultValue: "[]",
        },
    },
    {
        timestamps: false,
    }
);

module.exports = Case;
