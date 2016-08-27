"use strict";

var Topic = require('../models/topics.js');

module.exports = function(range) {
	if (range === undefined) {
		return Topic.find({});
	} else {
		return Topic.find({ 
			post_date: {
				$gt: new Date( new Date().setDate( new Date().getDate() - range ) )
			}
		});
	}
};