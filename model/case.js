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
            allowNull: true,
        },
        type: {
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
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        open: {
            // OK to open
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        format: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        target: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: "",
        },
        referer: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: "",
        },
        assigned: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        received: {
            // Recieved on
            type: DataTypes.DATEONLY,
            allowNull: true,
            defaultValue: DataTypes.NOW,
        },
        approved: {
            // Approved on
            type: DataTypes.DATEONLY,
            allowNull: true,
            defaultValue: DataTypes.NOW,
        },
        quoted: {
            // Quote sent on
            type: DataTypes.DATEONLY,
            allowNull: true,
            defaultValue: DataTypes.NOW,
        },
        
        completed: {
            // Completed on
            type: DataTypes.DATEONLY,
            allowNull: true,
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
