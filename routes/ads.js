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
//        console.log('data: ', require('util').inspect(Placements));
        res.json(resp);
    });



});

module.exports = router;
