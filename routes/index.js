const express = require('express');
const router = express.Router();

router.get('/', function (req, res, next) {
    //res.redirect('/login.htm');
    res.send("Express works!");
});

module.exports = router;