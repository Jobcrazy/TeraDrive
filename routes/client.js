const express = require('express');
const router = express.Router();
const auth = require("../common/auth");
const errorCode = require("../common/errorCode");
const utils = require("../common/utils");
const Client = require("../model/client");

/**
 * Get all client infomations
 */
router.get('/', auth, async function (req, res, next) {
    try {

        let pageOffset = (req.body.page-1) * req.body.size;
        let pageSize = req.body.size;
        let result;

        if(pageCount && pageSize){
            result = await Client.findAll({ offset: pageOffset, limit: pageSize });
        }else{
            result = await Client.findAll({});
        }
        
        utils.SendResult(res, result);
    } catch (error) {
        console.log(error);
        utils.SendError(res, error);
    }
});

/**
 * Get specific client infomations
 */
router.get('/:id', auth, async function (req, res, next) {
    try {
        let result = await Client.findAll({
            where: {
                id: req.params.id,
            },
            limit: 1
        });

        utils.SendResult(res, result);
    } catch (error) {
        console.log(error);
        utils.SendError(res, error);
    }
});

/**
 * Create client
 */
router.post('/', auth, async function (req, res, next) {
    try {
        await Client.create(
            {
                company: req.body.company,
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                date: req.body.date,
                phone: req.body.phone,
                address: req.body.address,
                email: req.body.email,
                postal: req.body.postal,
            }
        );

        utils.SendResult(res);
    } catch (error) {
        console.log(error);
        utils.SendError(res, error);
    }
});

/**
 * Update client
 */
router.put('/:id', auth, async function (req, res, next) {
    try {
        await Client.update({
            company: req.body.company,
            firstname: req.body.password,
            lastname: req.body.email,
            date: req.body.company,
            phone: req.body.password,
            address: req.body.email,
            email: req.body.company,
            postal: req.body.password,
        }, {
            where: {
                id: req.params.id,
            }
        });
        utils.SendResult(res);
    } catch (error) {
        console.log(error);
        utils.SendError(res, error);
    }
});


/**
 * Delete client
 */
router.delete('/:id', auth, async function (req, res, next) {
    try {
        await Client.destroy({
            where: {
                id: req.params.id,
            }
        });

        utils.SendResult(res);
    } catch (error) {
        console.log(error);
        utils.SendError(res, error);
    }
});

module.exports = router;