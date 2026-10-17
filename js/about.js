function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});
	
	//This line modifies the DOM, searching for the tag with the numberTweets ID and updating the text.
	//It works correctly, your task is to update the text of the other tags in the HTML file!
	document.getElementById('numberTweets').innerText = tweet_array.length;	

	var times = tweet_array.map(function(t) { return t.time.getTime(); });
	var options = {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'};
	var firstDateSpan = document.getElementById("firstDate");
	firstDateSpan.innerText = (new Date(Math.min.apply(null, times)).toLocaleDateString('en-US', options));
	var lastDateSpan = document.getElementById("lastDate");
	lastDateSpan.innerText = (new Date(Math.max.apply(null, times)).toLocaleDateString('en-US', options));


	var completedNumber = tweet_array.filter(function(t) { return t.source === "completed_event"; }).length;
	var completedPct = math.format((completedNumber / tweet_array.length) * 100, {notation: 'fixed', precision: 2}) + '%';
	var liveNumber = tweet_array.filter(function(t) { return t.source === "live_event"; }).length;
	var livePct = math.format((liveNumber / tweet_array.length) * 100, {notation: 'fixed', precision: 2}) + '%';
	var achievementNumber = tweet_array.filter(function(t) { return t.source === "achievement"; }).length;
	var achievementPct = math.format((achievementNumber / tweet_array.length) * 100, {notation: 'fixed', precision: 2}) + '%';
	var miscNumber = tweet_array.filter(function(t) { return t.source === "miscellaneous"; }).length;;
	var miscPct = math.format((miscNumber / tweet_array.length) * 100, {notation: 'fixed', precision: 2}) + '%';
	
	var completedSpans = document.getElementsByClassName("completedEvents");
	for (var i = 0; i < completedSpans.length; i++) {
		completedSpans[i].innerText = completedNumber;
		}
	var	completedPctSpans = document.getElementsByClassName("completedEventsPct");
	for (var i = 0; i < completedPctSpans.length; i++) {
		completedPctSpans[i].innerText = completedPct;
		}

	var liveSpans = document.getElementsByClassName("liveEvents");
	for (var i = 0; i < liveSpans.length; i++) {
		liveSpans[i].innerText = liveNumber;
		}
	var	livePctSpans = document.getElementsByClassName("liveEventsPct");
	for (var i = 0; i < livePctSpans.length; i++) {
		livePctSpans[i].innerText = livePct;
		}

	var achievementSpans = document.getElementsByClassName("achievements");
	for (var i = 0; i < achievementSpans.length; i++) {
		achievementSpans[i].innerText = achievementNumber;
		}
	var	achievementPctSpans = document.getElementsByClassName("achievementsPct");
	for (var i = 0; i < achievementPctSpans.length; i++) {
		achievementPctSpans[i].innerText = achievementPct;
		}
	
	var miscSpans = document.getElementsByClassName("miscellaneous");
	for (var i = 0; i < miscSpans.length; i++) {
		miscSpans[i].innerText = miscNumber;
		}
	var	miscPctSpans = document.getElementsByClassName("miscellaneousPct");
	for (var i = 0; i < miscPctSpans.length; i++) {
		miscPctSpans[i].innerText = miscPct;
		}


	var writtenNumber = tweet_array.filter(function(t) { return t.source === "completed_event" && t.written; }).length;
	var writtenPct = math.format((writtenNumber / completedNumber) * 100, {notation: 'fixed', precision: 2}) + '%';

	var writtenSpans = document.getElementsByClassName("written");
	for (var i = 0; i < writtenSpans.length; i++) {
		writtenSpans[i].innerText = writtenNumber;
		}
	var	writtenPctSpans = document.getElementsByClassName("writtenPct");
	for (var i = 0; i < writtenPctSpans.length; i++) {
		writtenPctSpans[i].innerText = writtenPct;
		}
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});