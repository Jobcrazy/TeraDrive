// Models, you must add all models here
const User = require("../model/user");
const Client = require("../model/client");
const Case = require("../model/case");
const File = require("../model/file");
const SMS = require("../model/sms");
const Email = require("../model/email");
const sequelize = require("./sequelize");
const utils = require("./utils");

// Create default admin
function createAdmin() {
    User.findAll({
        where: {
            id: 1,
        },
    })
        .then(function (result) {
            if (!result.length) {
                User.create({
                    id: 1,
                    username: "admin",
                    password: "admin",
                    isAdmin: true,
                    token: utils.CalcStringMD5("admin" + "admin"),
                })
                    .then(function () {
                        console.log("Admin account created!");
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            }
        })
        .catch(function (error) {
            console.log(error);
        });
}

// Sync Models
function syncModels() {
    // Define relationship
    Client.hasMany(Case, {
        onDelete: "RESTRICT",
        onUpdate: "RESTRICT",
    });
    Case.belongsTo(Client);

    sequelize
        .sync({ alter: true })
        .then(function (result) {
            console.log("Sync Model Complete!");

            // Create default admin account
            createAdmin();
        })
        .catch(function (err) {
            console.log(err);
        });
}

module.exports = syncModels;
