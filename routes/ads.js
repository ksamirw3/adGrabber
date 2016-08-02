var express = require('express');
var router = express.Router();



router.get('/', function (req, res, next) {

    var Grabber = require('../lib/grabber');
    Grabber = new Grabber();

    var data = Grabber.getAdParams(function (err, resp) {

        if (err) {
            console.log('err: ', require('util').inspect(err));
            res.json(err);
        }

    res.render('ads', { landingPage : resp });
//        res.json(resp);
    });



});

module.exports = router;
