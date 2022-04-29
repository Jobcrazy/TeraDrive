const utils = require("./utils");
const error_code = require("./errorCode");
const User = require("../model/user");

/*
 * This function should be added for any routers when we want to
 * check if a user has logged in.
 */
module.exports = function (req, res, next) {
    User.findAll({
        where: {
            token: req.headers.token,
        },
    })
        .then(function (users) {
            if (users.length && users[0].isAdmin) {
                next();
            } else {
                utils.SendError(res, error_code.error_not_admin);
            }
        })
        .catch(function (error) {
            utils.SendError(res, error);
        });
};
