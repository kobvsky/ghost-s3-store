// # AWS S3 Storage module

var express   = require('express'),
    fs        = require('fs-extra'),
    util      = require('util'),
    Promise   = require('bluebird'),
    errors    = require('../errors'),
    config    = require('../config'),
    utils     = require('../utils'),
    baseStore = require('./base');
    AWS       = require('aws-sdk');

function S3Store() {
    AWS.config.update(config.aws);
}
util.inherits(S3Store, baseStore);

S3Store.prototype.save = function (image) {
    var awsPath = 'https://' + config.aws.bucket + '.s3.amazonaws.com/';
    
    var targetDir = this.getTargetDir(),
        targetFilename;

    return this.getUniqueFileName(this, image, targetDir)
        .then(function (filename) {
            targetFilename = filename;
            return Promise.promisify(fs.readFile)(image.path);
        })
        .then(function (buffer) {
            var s3 = new AWS.S3();
            return Promise.promisify(s3.putObject.bind(s3))({
                Bucket: config.aws.bucket,
                Key: targetFilename,
                Body: buffer,
                ContentType: image.type
            });
        })
        .then(function (result) {
            var fullUrl = awsPath + targetFilename;
            return fullUrl;
        })
        .catch(function (e) {
            errors.logError(e);
            return Promise.reject(e);
        });
};

S3Store.prototype.exists = function (filename) {
    var s3 = new AWS.S3();
    return Promise.promisify(s3.headObject.bind(s3))({
        Bucket: config.aws.bucket,
        Key: filename
    })
    .catch(function (e) {
        if (e && e.cause && e.cause.name === 'NotFound') {
            return;
        }
        else {
            // somehow unexpected error occurred
            errors.logError(e);
            return Promise.reject(e);
        }
        
    });
        
};

// middleware for serving the files
S3Store.prototype.serve = function () {
    // nothing need
    return function(){};
};

module.exports = S3Store;
