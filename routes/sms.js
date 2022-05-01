const express = require("express");
const router = express.Router();
const auth = require("../common/auth");
const errorCode = require("../common/errorCode");
const utils = require("../common/utils");
const SMS = require("../model/sms");

/**
 * Get all SMS template
 */
router.post("/list", auth, async function (req, res, next) {
    try {
        let page = req.body.page ? req.body.page : 1;
        let limit = req.body.limit ? req.body.limit : 20;
        let offset = (page - 1) * limit;

        const count = await SMS.count();
        let cases = await SMS.findAll({ offset, limit });

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
        let result = await SMS.findOne({
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
        await SMS.create(req.body);

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
        await SMS.update(req.body, {
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
        await SMS.destroy({
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
 * Send SMS
 */
router.post("/send", auth, async function (req, res, next) {
    try {
        // No body and destination number
        if(!req.body.to || !req.body.body) utils.SendError(res, errorCode.error_sms);


        const textNumRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;

        let textToNumber = textNumRegex.exec(req.body.to)[0];
        let textBody = req.body.body;
        
        const accountSid = process.env.TWILIO_ACCOUNT_SID;
        const authToken = process.env.TWILIO_AUTH_TOKEN;

        const textFromNumber = "+17787439209";
        const client = require('twilio')(accountSid, authToken);

        await client.messages
        .create({
            body: textBody,
            from: textFromNumber,
            to: textToNumber
        })
        .then(message => console.log(message));

        utils.SendResult(res);
    } catch (error) {
        console.log(error);
        utils.SendError(res, error);
    }
});

module.exports = router;
