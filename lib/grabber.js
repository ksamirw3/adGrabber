"use strict";
var request = require('request');
var fs = require("fs");

var apiUrl = 'http://atemda.com/jsonadserving.ashx';
var paramsArray = new Array();
paramsArray['pbId'] = '165';
paramsArray['pId0'] = '85166768';
paramsArray['bfDim0'] = '300x600';
paramsArray['url'] = 'www.neuronad.com';
paramsArray['jse'] = '0';
paramsArray['uip'] = '213.115.48.146';
paramsArray['uas'] = 'Mozilla%2F5.0%20';
paramsArray['uid'] = '';
paramsArray['pc'] = '1';
paramsArray['rank0'] = '1';
paramsArray['rPos0'] = '1';
paramsArray['exm'] = '';
paramsArray['fl'] = '0';


var Grabber = function () {
    this.placements = [];
    this.landingPage = null;
}

Grabber.prototype.getAdParams = function (callback) {
    var self = this;
    var remotUrl = ArrayToURL(apiUrl, paramsArray);

    request(remotUrl, function (error, response, body) {
        if (error) {
            console.log('error: ', require('util').inspect(error));
            return callback(error, body);
        }

        if (!error && response.statusCode == 200) {

            var resp = JSON.parse(body);
            // set the response object
            self.placements = (resp['Placements'] && resp['Placements'].length > 0) ? resp['Placements'] : getStaticPlacements();

            var placement = null;

            // can use async.forEach here
            for (var i in self.placements) {
                placement = self.placements[i];
                console.log('MaterialUrl: ', placement['MaterialUrl']);
                console.log('LandingPage: ', placement['LandingPage']);

                // download IMG
                self.getConcreteAd(placement['MaterialUrl']);

                self.getRealAdLink(placement['LandingPage'], function (err, landingPage) {
                    self.landingPage = landingPage;
                    
                    return callback(null, self.landingPage);
                });
            }

//            return callback(null, self.landingPage);
        }
    })
}

Grabber.prototype.getConcreteAd = function (url) {
    request({uri: url}, function (error, response, body) {
        if (!error && response.statusCode == 200) {

            var data_uri_prefix = "data:" + response.headers["content-type"] + ";base64,";

            var imageBase64Encoded = data_uri_prefix + new Buffer(body, 'binary').toString('base64');

            var fileName = getRandomInt(11111, 88888888) + '.txt';

            fs.writeFileSync("./images/" + fileName, imageBase64Encoded);

        }
    });
}
Grabber.prototype.getRealAdLink = function (landingPage, callback) {
    
    // check is valid http url here
    if(landingPage){
        return callback(null, landingPage);
    }else{
        return callback(null, '');
    }
    
}

function ArrayToURL(url, array) {
    var pairs = [];
    for (var key in array)
        if (array.hasOwnProperty(key))
            pairs.push(encodeURIComponent(key) + '=' + encodeURIComponent(array[key]));
    return url + '?' + pairs.join('&');
}

function getStaticPlacements() {
    return [{
            Type: 'Image',
            PlacementId: 123,
            MaterialId: 11,
            Width: 300,
            Height: 200,
            MaterialUrl: 'http://photos4.meetupstatic.com/photos/event/4/e/7/2/global_91340082.jpeg',
            TrackingCodes: [],
            LandingPage: 'http://www.advertiser1.com/landingpage'
        }]

}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = Grabber;
