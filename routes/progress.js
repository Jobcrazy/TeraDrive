const express = require("express");
const router = express.Router();
const auth = require("../common/auth");
const errorCode = require("../common/errorCode");
const utils = require("../common/utils");
const Progress = require("../model/progress");

/**
 * Get all progress
 */
router.post("/list", auth, async function (req, res, next) {
    try {
        let page = req.body.page ? req.body.page : 1;
        let limit = req.body.limit ? req.body.limit : 20;
        let offset = (page - 1) * limit;

        const count = await Progress.count();
        let progresses = await Progress.findAll({ offset, limit });

        let data = {
            count,
            data: progresses,
        };

        utils.SendResult(res, data);
    } catch (error) {
        console.log(error);
        utils.SendError(res, error);
    }
});

/**
 * Get all progress information
 */
router.post("/all", auth, async function (req, res, next) {
    try {
        let progresses = await Progress.findAll();
        utils.SendResult(res, progresses);
    } catch (error) {
        console.log(error);
        utils.SendError(res, error);
    }
});

/**
 * Get specific progress information
 */
router.post("/detail", auth, async function (req, res, next) {
    try {
        let progress = await Progress.findOne({
            where: {
                id: req.body.id,
            },
            limit: 1,
        });

        if (!progress) {
            utils.SendError(res, errorCode.error_unknown);
            return;
        }

        utils.SendResult(res, progress);
    } catch (error) {
        console.log(error);
        utils.SendError(res, error);
    }
});

/**
 * Create progress
 */
router.post("/create", auth, async function (req, res, next) {
    try {
        await Progress.create(req.body);

        utils.SendResult(res);
    } catch (error) {
        console.log(error);
        utils.SendError(res, error);
    }
});

/**
 * Update progress
 */
router.post("/update", auth, async function (req, res, next) {
    try {
        await Progress.update(req.body, {
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
 * Delete progress
 */
router.post("/delete", auth, async function (req, res, next) {
    try {
        await Progress.destroy({
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
