const express = require('express');
const router = express.Router();
const auth = require("../common/auth");
const errorCode = require("../common/errorCode");
const utils = require("../common/utils");
const User = require("../model/user");

router.post('/create', async function (req, res, next) {
    try {
        await User.create(
            {
                username: req.body.username,
                password: req.body.password,
                email: req.body.email,
                admin: req.body.admin,
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
        req.session.id = result[0].id;
        req.session.username = result[0].username;

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
                id: req.session.id
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

module.exports = router;