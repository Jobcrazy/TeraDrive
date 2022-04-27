const express = require('express');
const router = express.Router();
const auth = require("../common/auth");
const checkAdmin = require("../common/isAdmin");
const errorCode = require("../common/errorCode");
const utils = require("../common/utils");
const User = require("../model/user");

router.post('/create', auth, checkAdmin, async function (req, res, next) {
    try {
        await User.create(
            {
                username: req.body.username,
                password: req.body.password,
                isAdmin: req.session.isAdmin,
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

router.post('/password', auth, async function (req, res, next) {
    try {
        await User.update({password: req.body.password}, {
            where: {
                id: req.session.uid,
            }
        });

        utils.SendResult(res);
    } catch (error) {
        console.log(error);
        utils.SendError(res, error);
    }
});

router.post('/list', auth, checkAdmin, async function (req, res, next) {
    try {
        let page = req.body.page ? req.body.page : 1;
        let limit = req.body.limit ? req.body.limit : 20;
        let offset = (page - 1) * limit;

        const count = await User.count();
        let result = await User.findAll({offset, limit});

        let data = {
            count,
            data: result
        };

        utils.SendResult(res, data);
    } catch (error) {
        console.log(error);
        utils.SendError(res, error);
    }
});

router.post('/detail', auth, checkAdmin, async function (req, res, next) {
    try {
        let result = await User.findAll({
            where: {
                id: req.body.id
            }
        });

        if (!result.length) {
            utils.SendError(res, errorCode.error_no_user);
            return;
        }

        utils.SendResult(res, result[0]);
    } catch (error) {
        console.log(error);
        utils.SendError(res, error);
    }
});

router.post('/update', auth, checkAdmin, async function (req, res, next) {
    try {
        await User.update(
            {
                username: req.body.username,
                password: req.body.password,
                isAdmin: parseInt(req.body.id) === 1 ? 1 : req.body.isAdmin, //id为1的必须是admin
            },
            {
                where: {
                    id: req.body.id,
                }
            });

        utils.SendResult(res);
    } catch (error) {
        console.log(error);
        utils.SendError(res, error);
    }
});

router.post('/delete', auth, checkAdmin, async function (req, res, next) {
    try {
        if (parseInt(req.body.id) === 1) {
            return utils.SendError(res, errorCode.error_del_sysadmin);
        }

        await User.destroy({
            where: {
                id: req.body.id,
            }
        });

        utils.SendResult(res);
    } catch (error) {
        console.log(error);
        utils.SendError(res, error);
    }
});

module.exports = router;