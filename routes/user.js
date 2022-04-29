const express = require("express");
const router = express.Router();
const auth = require("../common/auth");
const checkAdmin = require("../common/isAdmin");
const errorCode = require("../common/errorCode");
const utils = require("../common/utils");
const User = require("../model/user");

router.post("/create", auth, checkAdmin, async function (req, res, next) {
    try {
        await User.create({
            username: req.body.username,
            password: req.body.password,
            isAdmin: req.body.isAdmin,
            token: utils.CalcStringMD5(req.body.username + req.body.password),
        });
        utils.SendResult(res);
    } catch (error) {
        console.log(error);
        utils.SendError(res, error);
    }
});

router.post("/login", async function (req, res, next) {
    try {
        let user = await User.findOne({
            where: req.body,
        });

        if (!user) {
            utils.SendError(res, errorCode.error_credential);
            return;
        }

        utils.SendResult(res, user);
    } catch (error) {
        console.log(error);
        utils.SendError(res, error);
    }
});

router.get("/info", auth, async function (req, res, next) {
    try {
        let user = await User.findOne({
            where: {
                token: req.headers.token,
            },
        });

        if (!user) {
            utils.SendError(res, errorCode.error_credential);
            return;
        }

        utils.SendResult(res, user);
    } catch (error) {
        console.log(error);
        utils.SendError(res, error);
    }
});

router.post("/password", auth, async function (req, res, next) {
    try {
        let user = await User.findOne({
            where: {
                token: req.headers.token,
            },
        });

        user.token = utils.CalcStringMD5(user.username + req.body.password);
        await User.update(
            {
                password: req.body.password,
                token: user.token
            },
            {
                where: {
                    token: req.headers.token,
                },
            }
        );

        utils.SendResult(res, user);
    } catch (error) {
        console.log(error);
        utils.SendError(res, error);
    }
});

router.post("/list", auth, checkAdmin, async function (req, res, next) {
    try {
        let page = req.body.page ? req.body.page : 1;
        let limit = req.body.limit ? req.body.limit : 20;
        let offset = (page - 1) * limit;

        const count = await User.count();
        let users = await User.findAll({offset, limit});

        let data = {
            count,
            data: users,
        };

        utils.SendResult(res, data);
    } catch (error) {
        console.log(error);
        utils.SendError(res, error);
    }
});

router.post("/detail", auth, checkAdmin, async function (req, res, next) {
    try {
        let user = await User.findOne({
            where: {
                id: req.body.id,
            },
        });

        if (!user) {
            utils.SendError(res, errorCode.error_no_user);
            return;
        }

        utils.SendResult(res, user);
    } catch (error) {
        console.log(error);
        utils.SendError(res, error);
    }
});

router.post("/update", auth, checkAdmin, async function (req, res, next) {
    try {
        await User.update(
            {
                username: req.body.username,
                password: req.body.password,
                isAdmin: parseInt(req.body.id) === 1 ? 1 : req.body.isAdmin, //id为1的必须是admin
                token: utils.CalcStringMD5(req.body.username + req.body.password),
            },
            {
                where: {
                    id: req.body.id,
                },
            }
        );

        utils.SendResult(res);
    } catch (error) {
        console.log(error);
        utils.SendError(res, error);
    }
});

router.post("/delete", auth, checkAdmin, async function (req, res, next) {
    try {
        if (parseInt(req.body.id) === 1) {
            return utils.SendError(res, errorCode.error_del_sysadmin);
        }

        await User.destroy({
            where: {
                id: req.body.id,
            },
        });

        utils.SendResult(res);
    } catch (error) {
        console.log(error);
        utils.SendError(res, error);
    }
});

module.exports = router;
