"use strict";

var mongoose = require('mongoose');

var topicSchema = new mongoose.Schema({
	topic_id: Number,
	post_date: Date,
	title: String
});

module.exports = mongoose.model('Topic', topicSchema);