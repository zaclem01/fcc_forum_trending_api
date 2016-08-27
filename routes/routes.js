"use strict";

var express = require('express');
var router = express.Router();
var Topic = require('../models/topics.js');
var getTopicRange = require('../utils/getTopicRange.js');

// router.get('/api', function(req, res) {
// 	fetchTopics('latest', function(err, topics) {
// 		if (err) console.log(err);
// 		res.json(topics);
// 	});
// });

router.get('/api/trending/week', function(req, res) {
	var weekTopics = getTopicRange(7);
	var allTopics = getTopicRange();
	Promise.all([weekTopics, allTopics]).then(
		function(topics) {
			var week = topics[0];
			var all = topics[1];

			res.send(week);
		}
	);
});

module.exports = router;