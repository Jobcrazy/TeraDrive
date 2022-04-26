// Models, you must add all models here
const User = require("../model/user");
const sequelize = require("./sequelize");

// Sync Models
function syncModels() {
    sequelize.sync({ alter: true })
        .then(function (result) {
            console.log("Sync Model Complete!");
        })
        .catch(function (err) {
            console.log(err);
        });
}

module.exports = syncModels;