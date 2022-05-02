const express = require("express");
const router = express.Router();
const auth = require("../common/auth");
const errorCode = require("../common/errorCode");
const utils = require("../common/utils");
const Email = require("../model/email");
const config = require("config");

/**
 * Get all SMS template
 */
router.post("/list", auth, async function (req, res, next) {
    try {
        let page = req.body.page ? req.body.page : 1;
        let limit = req.body.limit ? req.body.limit : 20;
        let offset = (page - 1) * limit;

        const count = await Email.count();
        let cases = await Email.findAll({offset, limit});

        let data = {
            count,
            data: cases,
        };

        utils.SendResult(res, data);
    } catch (error) {
        console.log(error);
        utils.SendError(res, error);
    }
});

/**
 * Get a specific sms template
 */
router.post("/detail", auth, async function (req, res, next) {
    try {
        let result = await Email.findOne({
            where: {
                id: req.body.id,
            },
        });

        if (!result) {
            utils.SendError(res, errorCode.error_no_user);
            return;
        }

        utils.SendResult(res, result);
    } catch (error) {
        console.log(error);
        utils.SendError(res, error);
    }
});

/**
 * Create a SMS template
 */
router.post("/create", auth, async function (req, res, next) {
    try {
        await Email.create(req.body);

        utils.SendResult(res);
    } catch (error) {
        console.log(error);
        utils.SendError(res, error);
    }
});

/**
 * Update a SMS template
 */
router.post("/update", auth, async function (req, res, next) {
    try {
        await Email.update(req.body, {
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

/**
 * Delete a SMS template
 */
router.post("/delete", auth, async function (req, res, next) {
    try {
        await Email.destroy({
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
