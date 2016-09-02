"use strict";

var express = require('express');
var router = express.Router();
var getTrending = require('../utils/getTrending.js');
var Topic = require('../models/topics.js');

router.get('api/trending', function(req, res) {
	res.send('Use api/trending/:type ("daily" or "weekly") to access the trending data');
});

router.get('/api/trending/:type/', function(req, res) {
	var type = req.params.type;
	getTrending(type).then(function(trending) {
		res.json(trending);
	});
});

module.exports = router;