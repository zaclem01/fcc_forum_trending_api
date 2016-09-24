"use strict";

var _ = require('underscore');

var Topic = require('../models/topics.js');
var stopWords = require('./stopWords.js');


module.exports = function(type, timePeriods) {
	return new Promise(function(resolve, reject) {
		if (timePeriods === undefined) {
			switch(type) {
				case 'daily':
					timePeriods = 28;
					break;
				case 'weekly':
					timePeriods = 8;
					break;
				default:
					timePeriods = 180;
			}
		}

		var topics = [];
		var basis;

		if (type === 'daily') {
			basis = 1;
		} else if (type === 'weekly') {
			basis = 7;
		} else {
			return console.error('Trend type not recognized. Only daily or weekly supported.');
		}

		for (var i = 0; i < timePeriods; i++) {
			topics.push(getTopicRange((i + 1) * basis, i * basis));
		}

		var trendTotals = {};
		var baselineTotals = [];

		Promise.all(topics).then(function(periods) {

			periods.forEach(function(period, index) {

				period.forEach(function(topic) {

					var parsedTopic = parseTopic(topic);

					parsedTopic.forEach(function(word) {

						if (index === 0) {
							if(!(word in trendTotals)) {
								trendTotals[word] = 1;
							} else {
								trendTotals[word] = trendTotals[word] + 1;
							}
						} else {
							if (!baselineTotals[index]) {
								baselineTotals[index] = {};
							}
							if(!(word in baselineTotals[index])) {
								baselineTotals[index][word] = 1;
							} else {
								baselineTotals[index][word] = baselineTotals[index][word] + 1;
							}
						}
					});
				});
			});

			var zScores = [];

			for (var word in trendTotals) {
				var popSum = 0;
				var popSize = baselineTotals.length;

				baselineTotals.forEach(function(period) {
					if (word in period) {
						popSum += period[word];
					}
				});

				var popAvg = popSum / popSize;
				var popSquares = 0;
				
				baselineTotals.forEach(function(period) {
					if (!(word in period)) {
						popSquares += Math.pow((0 - popAvg), 2);
					} else {
						popSquares += Math.pow((period[word] - popAvg), 2);
					}
				});

				var popStd = Math.sqrt(popSquares);
				var score = popStd == 0 ? 0 : (trendTotals[word] - popAvg) / popStd;

				zScores.push({ word: word, zScore: score });
			}

			resolve(_.sortBy(zScores, 'zScore').reverse());
		});
	});

	
};


function getTopicRange(start, end) {
	return Topic.find({ 
		post_date: {
			$lt: new Date( new Date().setDate( new Date().getDate() - end ) ),
			$gte: new Date( new Date().setDate( new Date().getDate() - start ) )
		}
	});
}


function parseTopic(topic) {
	var title = topic.title;

	var noSpecialChars = title.toLowerCase().replace(/[^a-zA-Z0-9\s]/g, ' ');

	var split = noSpecialChars.split(/\s+/g);
	
	var parsed = [];
	split.forEach(function(word) {
		if (stopWords.indexOf(word) === -1 && parsed.indexOf(word) === -1) {
			parsed.push(word);
		}
	});

	return parsed;
}
