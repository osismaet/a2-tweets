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
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});