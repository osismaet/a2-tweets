function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}
	
	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});
	//TODO: Filter to just the written tweets
	written_tweets = tweet_array
		.filter(function(t) { return t.written; })
		.map(function(t) {
			return {tweet: t, lowerText: t.writtenText.toLowerCase()};
		});
}

function addEventHandlerForSearch() {
	//TODO: Search the written tweets as text is entered into the search box, and add them to the table
	var searchBox = document.getElementById('textFilter');
	var table = document.getElementById('tweetTable');
	var countSpan = document.getElementById('searchCount');
	var textSpan = document.getElementById('searchText');
	searchBox.addEventListener('input', function() {
		var query = searchBox.value;
		var lowerQuery = query.toLowerCase();
 
		textSpan.innerText = query;
 
		if(query === '') {
			table.innerHTML = '';
			countSpan.innerText = 0;
			return;
		}
 
		var rows = [];
		for(var i = 0; i < written_tweets.length; i++) {
			if(written_tweets[i].lowerText.includes(lowerQuery)) {
				rows.push(written_tweets[i].tweet.getHTMLTableRow(rows.length + 1));
			}
		}
 
		countSpan.innerText = rows.length;
		table.innerHTML = rows.join('');
	});
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	addEventHandlerForSearch();
	loadSavedRunkeeperTweets().then(parseTweets);
});