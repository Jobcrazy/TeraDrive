const express = require("express");
const router = express.Router();
const auth = require("../common/auth");
const errorCode = require("../common/errorCode");
const utils = require("../common/utils");
const Status = require("../model/status");

/**
 * Get all status
 */
router.post("/list", auth, async function (req, res, next) {
    try {
        let page = req.body.page ? req.body.page : 1;
        let limit = req.body.limit ? req.body.limit : 20;
        let offset = (page - 1) * limit;

        const count = await Status.count();
        let statuses = await Status.findAll({
            offset,
            limit,
            order: [["id", "DESC"]],
        });

        let data = {
            count,
            data: statuses,
        };

        utils.SendResult(res, data);
    } catch (error) {
        console.log(error);
        utils.SendError(res, error);
    }
});

/**
 * Get all status information
 */
router.post("/all", auth, async function (req, res, next) {
    try {
        let statuses = await Status.findAll();
        utils.SendResult(res, statuses);
    } catch (error) {
        console.log(error);
        utils.SendError(res, error);
    }
});

/**
 * Get specific status information
 */
router.post("/detail", auth, async function (req, res, next) {
    try {
        let status = await Status.findOne({
            where: {
                id: req.body.id,
            },
            limit: 1,
        });

        if (!status) {
            utils.SendError(res, errorCode.error_unknown);
            return;
        }

        utils.SendResult(res, status);
    } catch (error) {
        console.log(error);
        utils.SendError(res, error);
    }
});

/**
 * Create status
 */
router.post("/create", auth, async function (req, res, next) {
    try {
        await Status.create(req.body);

        utils.SendResult(res);
    } catch (error) {
        console.log(error);
        utils.SendError(res, error);
    }
});

/**
 * Update status
 */
router.post("/update", auth, async function (req, res, next) {
    try {
        await Status.update(req.body, {
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
 * Delete status
 */
router.post("/delete", auth, async function (req, res, next) {
    try {
        await Status.destroy({
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
