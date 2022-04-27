const utils = require('./utils');
const error_code = require('./errorCode');

/*
* This function should be added for any routers when we want to
* check if a user has logged in.
*/
module.exports = function (req, res, next) {
    if (req.session.isAdmin) {
        return next();
    } else {
        return utils.SendError(res, error_code.error_not_admin);
    }
}