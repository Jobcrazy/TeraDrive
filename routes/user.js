const express = require('express');
const router = express.Router();
const auth = require("../common/auth");
const errorCode = require("../common/errorCode");
const utils = require("../common/utils");
const User = require("../model/user");

router.post('/create', async function (req, res, next) {
    try {
        // Only admin user can create another admin user
        let isAdmin = req.session.isAdmin ? req.body.admin : false;

        await User.create(
            {
                username: req.body.username,
                password: req.body.password,
                email: req.body.email,
                isAdmin: isAdmin,
            }
        );
        utils.SendResult(res);
    } catch (error) {
        console.log(error);
        utils.SendError(res, error);
    }
});

router.post('/login', async function (req, res, next) {
    try {
        let result = await User.findAll({
            where: {
                username: req.body.username,
                password: req.body.password,
            }
        });

        if (!result.length) {
            utils.SendError(res, errorCode.error_credential);
            return;
        }

        // Login OK
        req.session.uid = result[0].id;
        req.session.username = result[0].username;
        req.session.isAdmin = result[0].isAdmin;

        utils.SendResult(res);
    } catch (error) {
        console.log(error);
        utils.SendError(res, error);
    }
});

router.get('/info', auth, async function (req, res, next) {
    try {
        let result = await User.findAll({
            where: {
                id: req.session.uid
            }
        });

        if (!result.length) {
            utils.SendError(res, errorCode.error_credential);
            return;
        }

        utils.SendResult(res, result[0]);
    } catch (error) {
        console.log(error);
        utils.SendError(res, error);
    }
});

router.get('/logout', auth, async function (req, res, next) {
    // Logout OK
    req.session.uid = null;
    req.session.username = null;
    req.session.isAdmin = null;

    utils.SendResult(res);
});

module.exports = router;