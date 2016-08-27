"use strict";

var Topic = require('../models/topics.js');

module.exports = function(topics) {
	for (var i = 0; i < topics.length; i++) {
		var topicID = topics[i].id;
		var topicDate = topics[i].created_at;
		var topicTitle = topics[i].title;

		// IIFE due to closure issues in for loop
		// Could use let keyword instead
		(function(id, date, title) {
			console.log(title);
			Topic.findOne({ topic_id: topicID }, function(err, topic) {
				if (err) {
					return console.error(err);
				} 
				if (topic) {
					return console.log('Topic already saved');
				} else {
					console.log('Attempting to save new topic');
					var newTopic = new Topic();

					newTopic.topic_id = id;
					newTopic.post_date = date;
					newTopic.title = title;

					newTopic.save(function(err) {
						console.error(err);
					});
				}
			});
		})(topicID, topicDate, topicTitle);
	}
};