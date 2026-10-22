class Tweet {
	private text:string;
	time:Date;

	constructor(tweet_text:string, tweet_time:string) {
        this.text = tweet_text;
		this.time = new Date(tweet_time);//, "ddd MMM D HH:mm:ss Z YYYY"
	}

	//returns either 'live_event', 'achievement', 'completed_event', or 'miscellaneous'
    get source():string {
        //TODO: identify whether the source is a live event, an achievement, a completed event, or miscellaneous.
        const t = this.text.toLowerCase();
        
        if (t.includes("right now") || t.includes("live") || t.includes("watch")) {
            return "live_event";
        }
        if (t.includes("achieved") || t.includes("set a goal")) {
            return "achievement";
        }
        if (t.startsWith("just completed") || t.startsWith("just posted")) {
            return "completed_event";
        }
        
        return "miscellaneous";
    }

    //returns a boolean, whether the text includes any content written by the person tweeting.
    get written():boolean {
        //TODO: identify whether the tweet is written
        const trimmedText = this.text
            .replace(/https?:\/\/\S+/g, "")
            .replace(/#runkeeper/gi, "")
            .replace(/\s+/g, " ")
            .trim();
        const idx = trimmedText.indexOf(" - ");
        if (idx < 0) {
            return false;
        }
        const finalText = trimmedText
            .slice(idx + 3)
            .replace(/\s*check it out!?$/i, "")
            .trim();

        if (finalText === "" || finalText.toLowerCase() === "tomtom mysports watch") {
            return false;
        }
        return true;
    }

    get writtenText():string {
        if (!this.written) {
            return "";
        }
        const trimmedText = this.text
            .replace(/https?:\/\/\S+/g, "")
            .replace(/#runkeeper/gi, "")
            .replace(/\s+/g, " ")
            .trim();
      
        const finalText = trimmedText
            .slice(trimmedText.indexOf(" - ") + 3)
            .replace(/\s*check it out!?$/i, "")
            .trim();

        //TODO: parse the written text from the tweet
        return finalText;
    }

    get activityType():string {
        if (this.source != 'completed_event') {
            return "unknown";
        }
        //TODO: parse the activity type from the text of the tweet
        let activity = this.text.match(/(?:completed|posted) an? ([\d.]+) ?(km|mi)\b (.+?)(?: in \d| with| -|\.|$)/i);
        if (activity) {
            return activity[3].trim().toLowerCase();
        }
        activity = this.text.match(/(?:completed|posted) an? (?:[\d:]+ ?(?:min|hr)?s? )?(.+?)(?: in \d| with| -|\.|$)/i);
        return activity ? activity[1].trim().toLowerCase() : "unknown";
    }

    get distance():number {
        if(this.source != 'completed_event') {
            return 0;
        }
        //TODO: prase the distance from the text of the tweet
        const dist = this.text.match(/(?:completed|posted) an? ([\d.]+) ?(km|mi)\b/i);
        if (!dist) {
            return 0;
        }
        const value = parseFloat(dist[1]);
        return dist[2].toLowerCase() === "km" ? value / 1.609 : value;
    }

    getHTMLTableRow(rowNumber:number):string {
        //TODO: return a table row which summarizes the tweet with a clickable link to the RunKeeper activity
        return "<tr></tr>";
    }
}