const express = require("express");
const router = express.Router();
const auth = require("../common/auth");
const errorCode = require("../common/errorCode");
const utils = require("../common/utils");
const SMS = require("../model/sms");
const config = require("config");
const PNF = require('google-libphonenumber').PhoneNumberFormat;
const phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance();

/**
 * Get all SMS template
 */
router.post("/list", auth, async function (req, res, next) {
    try {
        let page = req.body.page ? req.body.page : 1;
        let limit = req.body.limit ? req.body.limit : 20;
        let offset = (page - 1) * limit;

        const count = await SMS.count();
        let cases = await SMS.findAll({offset, limit});

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
        // No content body or destination number
        if (!req.body.phone || !req.body.content) {
            utils.SendError(res, errorCode.error_invalid_sms);
        }

        const config_sms = config.get("sms");
        const number = phoneUtil.parseAndKeepRawInput(req.body.phone, config_sms.country);
        const textToNumber = phoneUtil.format(number, PNF.E164);
        const accountSid = config_sms.id;
        const authToken = config_sms.key;
        const textFromNumber = config_sms.from;
        const smsClient = require('twilio')(accountSid, authToken);

        let message = await smsClient.messages.create({
            body: req.body.content,
            from: textFromNumber,
            to: textToNumber
        });
        console.log(message);

        utils.SendResult(res);
    } catch (error) {
        console.log(error);
        utils.SendError(res, error);
    }
});

module.exports = router;
