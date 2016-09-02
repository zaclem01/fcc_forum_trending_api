"use strict";

var request = require('request');
var https = require('https');

module.exports = function(type) {
	var url = 'http://forum.freecodecamp.com/' + type + '.json';
	return new Promise(function(resolve, reject) {
		request(url, function(err, res, body) {
			if (err) {
				reject(err);
			} else {
				try {
					var topics = JSON.parse(body);
					resolve(topics);
				} catch (err) {
					reject(err);
				}
			}
		});
	});
};