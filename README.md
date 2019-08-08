# twitter-engagement-tracker
Generates spreadsheet with list of users you do and don't follow and their engagement (likes and retweets) with your recent tweets.

----

I put this together to help me track user engagement with my art twitter ([@nightlyfieldlog](https://twitter.com/nightlyfieldlog)). I was particularly interested in
- how the users I follow are engaging with me,
- which users are engaging with my tweets the most frequently, so that I can show them some love, and
- if there are any users who are engaging with my tweets whom I do not follow, in order that I might follow them.

Because this is something I glued together just for me, expecting to use it once every few months, there is some really dumb copy/pasting and hardcoded nonsense. The dumb nonsense is a workaround around the Twitter API not allowing retrieval of the users who like or retweet a tweet; I couldn't immediately figure out how to port it into Google Apps Script and then I moved on. If you find a fix let me know!


## To Run ##
#### I. Set Up Your Spreadsheet ####
1. Create a spreadsheet in Google Drive. This is the spreadsheet we will populate with user engagement metrics.
2. In the toolbar at the top of your spreadsheet, go to `Tools` → `<> Script editor`.
3. Copy/paste the contents of the [`Code.gs` script in this repository](https://github.com/lakras/twitter-engagement-tracker/blob/master/Code.gs) into the `Code.gs` script attached to your spreadsheet.

#### II. Set Up Missing Variables ####
A lot of variables at the top of `Code.gs` are missing. You'll need to fill them in before running the script.
1. Fill in your twitter username and [access tokens](https://developer.twitter.com/en/docs/basics/authentication/guides/access-tokens.html).
2. Fill in the lists of users who have engaged with (liked or retweeted) your 20 and 200 most recent tweets. This one's the one that's a mess.
    1. Retrieve the tweet ids of your recent tweets:
        1. Run `get20MostRecentTweetIDs` in `Code.gs` (`Run` → `Run function` → `get20MostRecentTweetIDs`).
        2. Copy the output (`View` → `Logs`) into the variable `last20_post_ids` in `user_ids_of_post_engagements.py`.
        3. Run `get200MostRecentTweetIDs` in `Code.gs`.
        4. Copy the output into the variable `last200_post_ids` in `user_ids_of_post_engagements.py`.
    2. Run `user_ids_of_post_engagements.py`:
        1. Download `user_ids_of_post_engagements.py`.
        2. In your terminal, [navigate](https://www.macworld.com/article/2042378/master-the-command-line-navigating-files-and-folders.html) to the directory containing `user_ids_of_post_engagements.py`.
        3. Type `python user_ids_of_post_engagements.py` and hit enter.
    3. Copy the output lists into the variables `usersWhoLikedLast20Tweets`, `usersWhoLikedLast200Tweets`, `usersWhoRetweetedLast20Tweets`, and `usersWhoRetweetedLast200Tweets` in `Code.gs`.

#### III. Run the Script ####
Run `getTwitterFollowsMetrics` in `Code.gs` (`Run` → `Run function` → `getTwitterFollowsMetrics`). User engagement metrics should start appearing immediately, line by line.


## Output ##
The script generates one row for every user you follow. After that, the script also generates one row for every user you _don't_ follow who has liked or retweeted one of your 200 most recent tweets, in case you'd like to check them out. :)

Columns generated:
- `user` username or user id with link to their twitter page
- `followers` number users following user
- `follows` number users that user is following
- `location` user's location
- `likes in last 200 tweets` number of your 200 most recent tweets that user has liked
- `likes in last 20 tweets` number of your 20 most recent tweets that user has liked
- `retweets in last 200 tweets` number of your 200 most recent tweets that user has retweeted
- `retweets in last 20 tweets` number of your 20 most recent tweets that user has retweeted

## Analysis ##
If you're new to Google Spreadsheets, you might find the following helpful:
1. `View` → `Freeze` → `1 row`.
2. Highlight the first row. `Data` → `Create a filter`.
3. Click the triangle on the lower right of each title in the first row to sort and filter your data.

## Sources ##
A big thank you to the following, which I mercilessly pillaged:
- https://ctrlq.org/code/19963-twitter-followers-script
- https://developers.google.com/google-ads/scripts/docs/examples/twitter-oauth20
- https://stackoverflow.com/a/37239790
