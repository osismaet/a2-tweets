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

	distanceVisSpec = {
	  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
	  "description": "Distance by day of the week for the three most Tweeted activities.",
	  "data": {
	    "values": distanceData
	  },
	  "mark": "point",
	  "encoding": {
	    "x": {"field": "day", "type": "nominal", "sort": days, "title": "time (day)"},
	    "y": {"field": "distance", "type": "quantitative", "title": "distance"},
	    "color": {"field": "activityType", "type": "nominal", "title": "Activity type"}
	  }
	};
	vegaEmbed('#distanceVis', distanceVisSpec, {actions:false});
 
	distanceVisAggregatedSpec = {
	  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
	  "description": "Mean distance by day of the week for the three most Tweeted activities.",
	  "data": {
	    "values": distanceData
	  },
	  "mark": "point",
	  "encoding": {
	    "x": {"field": "day", "type": "nominal", "sort": days, "title": "time (day)"},
	    "y": {"field": "distance", "type": "quantitative", "aggregate": "mean", "title": "Mean of distance"},
	    "color": {"field": "activityType", "type": "nominal", "title": "Activity type"}
	  }
	};
	vegaEmbed('#distanceVisAggregated', distanceVisAggregatedSpec, {actions:false});
 
	var rawDiv = document.getElementById('distanceVis');
	var aggDiv = document.getElementById('distanceVisAggregated');
	var button = document.getElementById('aggregate');
	if(aggDiv) {
		aggDiv.style.display = 'none';
	}
	if(button && rawDiv && aggDiv) {
		var showingAggregate = false;
		button.addEventListener('click', function() {
			showingAggregate = !showingAggregate;
			rawDiv.style.display = showingAggregate ? 'none' : 'block';
			aggDiv.style.display = showingAggregate ? 'block' : 'none';
			button.innerText = showingAggregate ? 'Show all activities' : 'Show means';
		});
	}
	
	var actForLongestSpan = document.getElementById("longestActivityType");
	actForLongestSpan.innerText = "bike";

	var actForShortestSpan = document.getElementById("shortestActivityType");
	actForShortestSpan.innerText = "walk";

	var weekendSpan = document.getElementById("weekdayOrWeekendLonger");
	weekendSpan.innerText = "weekends";

	//TODO: create a new array or manipulate tweet_array to create a graph of the number of tweets containing each type of activity.

	// activity_vis_spec = {
	//   "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
	//   "description": "A graph of the number of Tweets containing each type of activity.",
	//   "data": {
	//     "values": tweet_array
	//   }
	//   //TODO: Add mark and encoding
	// };
	// vegaEmbed('#activityVis', activity_vis_spec, {actions:false});

	//TODO: create the visualizations which group the three most-tweeted activities by the day of the week.
	//Use those visualizations to answer the questions about which activities tended to be longest and when.
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});