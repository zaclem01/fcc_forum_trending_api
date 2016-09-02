"use strict";

var express = require('express');
var app = express();
var mongoose = require('mongoose');

var routes = require('./routes/routes.js');
var fetchTopics = require('./utils/fetchTopics.js');
var saveTopics = require('./utils/saveTopics.js');
var port = 3000;

mongoose.connect(require('./config/database.js'), function(err) {
	if (err) {
		console.error('Error connecting to the database');
	} else {
		console.log('Connected to database successfully!');
	}
});
mongoose.Promise = Promise;

app.use(routes);

app.listen(port, function(){

	console.log('Server listening on port ' + port);
	var counter = 1;

	setInterval(function() {
		console.log('Run number', counter);
		counter++;
		fetchTopics('latest')
			.then(function(topics) {
				var topicsList = topics.topic_list.topics;
				saveTopics(topicsList);
			})
			.catch(function(err) {
				console.error('There was a problem fetching the topics (crossorigin.me likely down):', err);
			});
	}, 900000); // Run scrape every 15 minutes on server start
});