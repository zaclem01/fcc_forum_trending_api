"use strict";

var request = require('request');
var https = require('https');

module.exports = function(type, callback) {
	var url = 'https://crossorigin.me/http://forum.freecodecamp.com/' + type + '.json';
	request(url, function(err, res, body) {
		if (err) {
			callback(err);
		} else {
			try {
				var topics = JSON.parse(body);
				callback(null, topics);
			} catch (err) {
				callback(err);
			}
		}
	});
};