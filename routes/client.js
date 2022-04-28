const express = require("express");
const router = express.Router();
const auth = require("../common/auth");
const errorCode = require("../common/errorCode");
const utils = require("../common/utils");
const Client = require("../model/client");

/**
 * Get all client information
 */
router.post("/list", auth, async function (req, res, next) {
    try {
        let page = req.body.page ? req.body.page : 1;
        let limit = req.body.limit ? req.body.limit : 20;
        let offset = (page - 1) * limit;

        const count = await Client.count();
        let customers = await Client.findAll({offset, limit});

        let data = {
            count,
            data: customers,
        };

        utils.SendResult(res, data);
    } catch (error) {
        console.log(error);
        utils.SendError(res, error);
    }
});

/**
 * Get all client information
 */
router.post("/all", auth, async function (req, res, next) {
    try {
        let customers = await Client.findAll();
        utils.SendResult(res, customers);
    } catch (error) {
        console.log(error);
        utils.SendError(res, error);
    }
});

/**
 * Get specific client information
 */
router.post("/detail", auth, async function (req, res, next) {
    try {
        let customer = await Client.findOne({
            where: {
                id: req.body.id,
            },
            limit: 1,
        });

        if (!customer) {
            utils.SendError(res, errorCode.error_no_user);
            return;
        }

        utils.SendResult(res, customer);
    } catch (error) {
        console.log(error);
        utils.SendError(res, error);
    }
});

/**
 * Create client
 */
router.post("/create", auth, async function (req, res, next) {
    try {
        await Client.create({
            company: req.body.company,
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            date: req.body.date,
            phone: req.body.phone,
            address: req.body.address,
            email: req.body.email,
            postal: req.body.postal,
        });

        utils.SendResult(res);
    } catch (error) {
        console.log(error);
        utils.SendError(res, error);
    }
});

/**
 * Update client
 */
router.post("/update", auth, async function (req, res, next) {
    try {
        await Client.update(
            {
                company: req.body.company,
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                date: req.body.date,
                phone: req.body.phone,
                address: req.body.address,
                email: req.body.email,
                postal: req.body.postal,
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

/**
 * Delete client
 */
router.post("/delete", auth, async function (req, res, next) {
    try {
        await Client.destroy({
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
