function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}
	
	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});
	
	var completed = tweet_array.filter(function(t) {
		return t.source === 'completed_event' && t.activityType !== 'unknown' && t.activityType !== '';
	});
	
	var counts = {};
	completed.forEach(function(t) {
		counts[t.activityType] = (counts[t.activityType] || 0) + 1;
	});
	var activityNumber = Object.keys(counts).map(function(type) {
		return {activityType: type, count: counts[type]};
	}).sort(function(a, b) { return b.count - a.count; });


	var activityNumberSpan = document.getElementById("numberActivities");
	activityNumberSpan.innerText = activityNumber.length;

	var firstActivitySpan = document.getElementById("firstMost");
	firstActivitySpan.innerText = activityNumber[0].activityType;

	var secondActivitySpan = document.getElementById("secondMost");
	secondActivitySpan.innerText = activityNumber[1].activityType;

	var thirdActivitySpan = document.getElementById("thirdMost");
	thirdActivitySpan.innerText = activityNumber[2].activityType;


	var topThree = activityNumber.slice(0, 3).map(function(a) { return a.activityType; });
	
	var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
	var distanceData = completed
		.filter(function(t) { return topThree.indexOf(t.activityType) >= 0 && t.distance > 0; })
		.map(function(t) {
			return {
				activityType: t.activityType,
				distance: t.distance,
				day: days[t.time.getDay()]
			};
		});

	var meanByType = [];
	for(var i = 0; i < topThree.length; i++) {
		var typeSum = 0;
		var typeCount = 0;
		for(var j = 0; j < distanceData.length; j++) {
			if(distanceData[j].activityType === topThree[i]) {
				typeSum += distanceData[j].distance;
				typeCount++;
			}
		}
		meanByType.push({type: topThree[i], mean: typeCount === 0 ? 0 : typeSum / typeCount});
	}
	meanByType.sort(function(a, b) { return b.mean - a.mean; });

	var actForLongestSpan = document.getElementById("longestActivityType");
	actForLongestSpan.innerText = meanByType[0].type;

	var actForShortestSpan = document.getElementById("shortestActivityType");
	actForShortestSpan.innerText = meanByType[meanByType.length - 1].type;

	var weekendSum = 0;
	var weekendCount = 0;
	var weekdaySum = 0;
	var weekdayCount = 0;
	for(var k = 0; k < distanceData.length; k++) {
		if(distanceData[k].day === 'Sat' || distanceData[k].day === 'Sun') {
			weekendSum += distanceData[k].distance;
			weekendCount++;
		} else {
			weekdaySum += distanceData[k].distance;
			weekdayCount++;
		}
	}
	var weekendMean = weekendCount === 0 ? 0 : weekendSum / weekendCount;
	var weekdayMean = weekdayCount === 0 ? 0 : weekdaySum / weekdayCount;

	var weekendSpan = document.getElementById("weekdayOrWeekendLonger");
	weekendSpan.innerText = weekendMean > weekdayMean ? 'weekends' : 'weekdays';

	//TODO: create a new array or manipulate tweet_array to create a graph of the number of tweets containing each type of activity.

	activity_vis_spec = {
	  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
	  "description": "A graph of the number of Tweets containing each type of activity.",
	  "data": {
	    "values": tweet_array
	  }
	  //TODO: Add mark and encoding
	};
	vegaEmbed('#activityVis', activity_vis_spec, {actions:false});

	//TODO: create the visualizations which group the three most-tweeted activities by the day of the week.
	//Use those visualizations to answer the questions about which activities tended to be longest and when.
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});