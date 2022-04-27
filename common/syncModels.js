// Models, you must add all models here
const User = require("../model/user");
const Client = require("../model/client")
const sequelize = require("./sequelize");

// Create default admin
function createAdmin(){
    User.findAll({
        where: {
            id: 1
        }
    })
    .then(function(result){
        if(!result.length){
            User.create(
                {
                    id: 1,
                    username: "admin",
                    password: "admin",
                    isAdmin: true,
                }
            )
            .then(function(){
                console.log("Admin account created!");
            })
            .catch(function(error){
                console.log(error);
            });
        }
    })
    .catch(function(error){
        console.log(error);
    });    
}

// Sync Models
function syncModels() {
    sequelize.sync({ alter: true })
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