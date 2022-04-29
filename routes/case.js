const express = require("express");
const router = express.Router();
const auth = require("../common/auth");
const errorCode = require("../common/errorCode");
const utils = require("../common/utils");
const Case = require("../model/case");

/**
 * Get all cases
 */
router.post("/list", auth, async function (req, res, next) {
    try {
        let page = req.body.page ? req.body.page : 1;
        let limit = req.body.limit ? req.body.limit : 20;
        let offset = (page - 1) * limit;

        const count = await Case.count();
        let cases = await Case.findAll({offset, limit});

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
 * Get specific case information
 */
router.post("/detail", auth, async function (req, res, next) {
    try {
        let result = await Case.findOne({
            where: {
                id: req.body.id,
            },
            limit: 1,
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
 * Create case
 */
router.post("/create", auth, async function (req, res, next) {
    try {
        await Case.create(req.body);

        utils.SendResult(res);
    } catch (error) {
        console.log(error);
        utils.SendError(res, error);
    }
});

/**
 * Update case
 */
router.post("/update", auth, async function (req, res, next) {
    try {
        await Case.update(
            req.body,
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

/**
 * Delete case
 */
router.post("/delete", auth, async function (req, res, next) {
    try {
        await Case.destroy({
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
