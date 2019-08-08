// follow the instructions below to fill in the missing variables.
// then, run getTwitterFollowsMetrics to populate your spreadsheet

// generates one row for every user you follow.
// also generates one row for every user you DON'T follow who has liked
// or retweeted one of your 200 most recent tweets, in case you'd like
// to check them out :)

// columns generated:
//   user (username or user id with link to their twitter page)
//   followers (number users following user)
//   follows (number users that user is following)
//   location (user's location)
//   likes in last 200 tweets (number of your 200 most recent tweets that user has liked)
//   likes in last 20 tweets (number of your 20 most recent tweets that user has liked)
//   retweets in last 200 tweets (number of your 200 most recent tweets that user has retweeted)
//   retweets in last 20 tweets (number of your 20 most recent tweets that user has retweeted)

// your twitter username
var username = 'yourtwitterusername';

// the access tokens that allow Google Apps Script to communicate with the Twitter API
// see https://developer.twitter.com/en/docs/basics/authentication/guides/access-tokens.html
var TWITTER_CONSUMER_KEY = '';
var TWITTER_CONSUMER_SECRET = '';

// lists of users who have engaged with (liked or retweeted) your 20 and 200 most recent tweets
// to generate:
//   1. retrieve ids of recent tweets:
//     1. run get20MostRecentTweetIDs in this script (Run -> get20MostRecentTweetIDs)
//     2. copy the output (View -> Logs) into the variable last20_post_ids in user_ids_of_post_engagements.py
//     3. run get200MostRecentTweetIDs in this script
//     4. copy the output into the variable last200_post_ids in user_ids_of_post_engagements.py
//   2. run user_ids_of_post_engagements.py (python user_ids_of_post_engagements.py in the terminal)
//   3. copy the output values into the below variables usersWhoLikedLast20Tweets, usersWhoLikedLast200Tweets, usersWhoRetweetedLast20Tweets, usersWhoRetweetedLast200Tweets
// (i know this is a really sucky way of doing this but it's good enough for me to run every now and then.
// this is a workaround around the twitter API not allowing retrieval of the users who like or retweet a tweet;
// i couldn't immediately figure out how to port it into Google Apps Script. if you find a fix let me know!)
var usersWhoLikedLast20Tweets = ['00000000000000000000']
var usersWhoLikedLast200Tweets = ['00000000000000000000']
var usersWhoRetweetedLast20Tweets = ['00000000000000000000']
var usersWhoRetweetedLast200Tweets = ['00000000000000000000']

// retrieves tweet ids of username's 20 most recent tweets
function get20MostRecentTweetIDs()
{
	getRecentTweetIDs(20);
}

// retrieves tweet ids of username's 200 most recent tweets
function get200MostRecentTweetIDs()
{
	getRecentTweetIDs(200);
}

var authUrlFetch;
function getRecentTweetIDs(numberRecentTweets)
{
  initializeOAuthClient();
  
  var url = 'https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name='+username+'&count='+numberRecentTweets+';';
  var response = authUrlFetch.fetch(url);
  var parsedTweets = JSON.parse(response.getContentText());
  if(parsedTweets)
  {
    var output = "";
    for(var index in parsedTweets)
    {
      if(output)
      {
        output += ', ';
      }
      output += parsedTweets[index]['id_str'];
    }
  }
  Logger.log(output);
}

var numberLikesInLast20Tweets;     // key: userid -> value: number of times user has liked one of most recent 20 tweets
var numberLikesInLast200Tweets;    // key: userid -> value: number of times user has liked one of most recent 200 tweets

var numberRetweetsInLast20Tweets;  // key: userid -> value: number of times user has retweeted one of most recent 20 tweets
var numberRetweetsInLast200Tweets; // key: userid -> value: number of times user has retweeted one of most recent 200 tweets

var userIsFollowed; // key: user is a follower

// counts up how many times users have liked or retweeted any of your
// 20 or 200 most recent tweets
function accountForTweetLikes()
{
  // accounts for users who liked last 20 tweets
  numberLikesInLast20Tweets = {};
  userIsFollowed = {};
  for(var userIndex in usersWhoLikedLast20Tweets)
  {
    var user = usersWhoLikedLast20Tweets[userIndex];
    if(numberLikesInLast20Tweets[user] === undefined)
    {
      numberLikesInLast20Tweets[user] = 1;
      userIsFollowed[user] = false;
    }
    else
    {
      numberLikesInLast20Tweets[user]++;
    }
  }
  
  // accounts for users who liked last 200 tweets
  numberLikesInLast200Tweets = {};
  for(var userIndex in usersWhoLikedLast200Tweets)
  {
    var user = usersWhoLikedLast200Tweets[userIndex];
    if(numberLikesInLast200Tweets[user] === undefined)
    {
      numberLikesInLast200Tweets[user] = 1;
      userIsFollowed[user] = false;
    }
    else
    {
      numberLikesInLast200Tweets[user]++;
    }
  }
  
  // accounts for users who retweeted last 20 tweets
  numberRetweetsInLast20Tweets = {};
  userIsFollowed = {};
  for(var userIndex in usersWhoRetweetedLast20Tweets)
  {
    var user = usersWhoRetweetedLast20Tweets[userIndex];
    if(numberRetweetsInLast20Tweets[user] === undefined)
    {
      numberRetweetsInLast20Tweets[user] = 1;
      userIsFollowed[user] = false;
    }
    else
    {
      numberRetweetsInLast20Tweets[user]++;
    }
  }
  
  // accounts for users who retweeted last 200 tweets
  numberRetweetsInLast200Tweets = {};
  for(var userIndex in usersWhoRetweetedLast200Tweets)
  {
    var user = usersWhoRetweetedLast200Tweets[userIndex];
    if(numberRetweetsInLast200Tweets[user] === undefined)
    {
      numberRetweetsInLast200Tweets[user] = 1;
      userIsFollowed[user] = false;
    }
    else
    {
      numberRetweetsInLast200Tweets[user]++;
    }
  }
}

function countFollowedUserRetweetsInLast200Tweets(userID)
{
  userIsFollowed[userID] = true;
  
  var retweetsInLast200Tweets = numberRetweetsInLast200Tweets[userID];
  if(retweetsInLast200Tweets === undefined)
  {
    retweetsInLast200Tweets = 0;
  }
  return retweetsInLast200Tweets;
}

function countFollowedUserRetweetsInLast20Tweets(userID)
{
  userIsFollowed[userID] = true;
  
  var retweetsInLast20Tweets = numberRetweetsInLast20Tweets[userID];
  if(retweetsInLast20Tweets === undefined)
  {
    retweetsInLast20Tweets = 0;
  }
  return retweetsInLast20Tweets;
}

function countFollowedUserLikesInLast200Tweets(userID)
{
  userIsFollowed[userID] = true;
  
  var likesInLast200Tweets = numberLikesInLast200Tweets[userID];
  if(likesInLast200Tweets === undefined)
  {
    likesInLast200Tweets = 0;
  }
  return likesInLast200Tweets;
}

function countFollowedUserLikesInLast20Tweets(userID)
{
  userIsFollowed[userID] = true;
  
  var likesInLast20Tweets = numberLikesInLast20Tweets[userID];
  if(likesInLast20Tweets === undefined)
  {
    likesInLast20Tweets = 0;
  }
  return likesInLast20Tweets;
}

function addNonFollows()
{
  var spreadsheet = SpreadsheetApp.getActive().getActiveSheet();
  for(var userID in userIsFollowed)
  {
    if(!userIsFollowed[userID])
    {
      var likesInLast20Tweets = numberLikesInLast20Tweets[userID];
      if(likesInLast20Tweets === undefined)
      {
        likesInLast20Tweets = 0;
      }
      
      var likesInLast200Tweets = numberLikesInLast200Tweets[userID];
      if(likesInLast200Tweets === undefined)
      {
        likesInLast200Tweets = 0;
      }
      
      var retweetsInLast20Tweets = numberRetweetsInLast20Tweets[userID];
      if(retweetsInLast20Tweets === undefined)
      {
        retweetsInLast20Tweets = 0;
      }
      
      var retweetsInLast200Tweets = numberRetweetsInLast200Tweets[userID];
      if(retweetsInLast200Tweets === undefined)
      {
        retweetsInLast200Tweets = 0;
      }
      
      spreadsheet.appendRow([
        '=hyperlink("https://twitter.com/intent/user?user_id=' + userID + '","' + userID + '")',
        '',
        '',
        '',
        likesInLast200Tweets,
        likesInLast20Tweets,
        retweetsInLast200Tweets,
        retweetsInLast20Tweets
      ]);
    }
  }
}

// the most important function!
// generates the spreadsheet described in the comment at the top of this script
function getTwitterFollowsMetrics()
{
  initializeOAuthClient();
  accountForTweetLikes();
  var followersPerPage = 200; // the maximum allowed
  var maximumUsersFollowed = 7000; // maximum number users we expect to be following; normal twitter follow limit is 5,000
  
  var spreadsheet = SpreadsheetApp.getActive().getActiveSheet();
  spreadsheet.appendRow([
    'user',
    'followers',
    'follows',
    'location',
    'likes in last 200 tweets',
    'likes in last 20 tweets',
    'retweets in last 200 tweets',
    'retweets in last 20 tweets'
  ]);
  
  var pages = 0;
  var cursor = '-1';
  while(pages < maximumUsersFollowed/followersPerPage && cursor != '0')
  {
    var url = 'https://api.twitter.com/1.1/friends/list.json?cursor='+cursor+'&screen_name='+username+'&count='+followersPerPage+'&cursor='+cursor+'&skip_status=true&include_user_entities=false;';
    var response = authUrlFetch.fetch(url); 
    var parsedResponse = JSON.parse(response.getContentText())
    if(parsedResponse)
    {
      for (var userNumber in parsedResponse.users)
      {
        var user = parsedResponse.users[userNumber];
        spreadsheet.appendRow([
          '=hyperlink("http://twitter.com/' + user.screen_name + '","' + user.name + '")',
          user.followers_count,
          user.friends_count,
          user.location,
          countFollowedUserLikesInLast200Tweets(user.id_str),
          countFollowedUserLikesInLast20Tweets(user.id_str),
          countFollowedUserRetweetsInLast200Tweets(user.id_str),
          countFollowedUserRetweetsInLast20Tweets(user.id_str)
        ]);
      } 
    }
    cursor = parsedResponse.next_cursor_str;
    pages++;
  }
  addNonFollows(); // add users you don't currently follow to your spreadsheet
}


// ---------------------------------------------------------------------------------


// initializes OAuth client
// copied from:
//    https://developers.google.com/google-ads/scripts/docs/examples/twitter-oauth20
function initializeOAuthClient() {
  if (typeof OAuth2 === 'undefined') {
    var libUrl = 'https://developers.google.com/google-ads/scripts/docs/examples/oauth20-library';
    throw Error('OAuth2 library not found. Please take a copy of the OAuth2 ' +
        'library from ' + libUrl + ' and append to the bottom of this script.');
  }
  var tokenUrl = 'https://api.twitter.com/oauth2/token';
  authUrlFetch = OAuth2.withClientCredentials(
      tokenUrl, TWITTER_CONSUMER_KEY, TWITTER_CONSUMER_SECRET);
}

// below is OAuth2 library, pasted in from:
//    https://developers.google.com/google-ads/scripts/docs/examples/oauth20-library

/**
 * Simple library for sending OAuth2 authenticated requests.
 * See: https://developers.google.com/google-ads/scripts/docs/features/third-party-apis#oauth_2
 * for full details.
 */

/**
 * Adds a OAuth object, for creating authenticated requests, to the global
 * object.
 */
(function(scope) {
  /**
   * Creates an object for making authenticated URL fetch requests with a
   * given stored access token.
   * @param {string} accessToken The access token to store and use.
   * @constructor
   */
  function OAuth2UrlFetchApp(accessToken) { this.accessToken_ = accessToken; }

  /**
   * Performs an HTTP request for the given URL.
   * @param {string} url The URL to fetch
   * @param {?Object=} options Options as per UrlFetchApp.fetch
   * @return {!HTTPResponse} The HTTP Response object.
   */
  OAuth2UrlFetchApp.prototype.fetch = function(url, opt_options) {
    var fetchOptions = opt_options || {};
    if (!fetchOptions.headers) {
      fetchOptions.headers = {};
    }
    fetchOptions.headers.Authorization = 'Bearer ' + this.accessToken_;
    return UrlFetchApp.fetch(url, fetchOptions);
  };

  /**
   * Performs the authentication step
   * @param {string} tokenUrl The endpoint for use in obtaining the token.
   * @param {!Object} payload The authentication payload, typically containing
   *     details of the grant type, credentials etc.
   * @param {string=} opt_authHeader Client credential grant also can make use
   *     of an Authorisation header, as specified here
   * @param {string=} opt_scope Optional string of spaced-delimited scopes.
   * @return {string} The access token
   */
  function authenticate_(tokenUrl, payload, opt_authHeader, opt_scope) {
    var options = {muteHttpExceptions: true, method: 'POST', payload: payload};
    if (opt_scope) {
      options.payload.scope = opt_scope;
    }
    if (opt_authHeader) {
      options.headers = {Authorization: opt_authHeader};
    }
    var response = UrlFetchApp.fetch(tokenUrl, options);
    var responseData = JSON.parse(response.getContentText());
    if (responseData && responseData.access_token) {
      var accessToken = responseData.access_token;
    } else {
      throw Error('No access token received: ' + response.getContentText());
    }
    return accessToken;
  }

  /**
   * Creates a OAuth2UrlFetchApp object having authenticated with a refresh
   * token.
   * @param {string} tokenUrl The endpoint for use in obtaining the token.
   * @param {string} clientId The client ID representing the application.
   * @param {string} clientSecret The client secret.
   * @param {string} refreshToken The refresh token obtained through previous
   *     (possibly interactive) authentication.
   * @param {string=} opt_scope Space-delimited set of scopes.
   * @return {!OAuth2UrlFetchApp} The object for making authenticated requests.
   */
  function withRefreshToken(
      tokenUrl, clientId, clientSecret, refreshToken, opt_scope) {
    var payload = {
      grant_type: 'refresh_token',
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken
    };
    var accessToken = authenticate_(tokenUrl, payload, null, opt_scope);
    return new OAuth2UrlFetchApp(accessToken);
  }

  /**
   * Creates a OAuth2UrlFetchApp object having authenticated with client
   * credentials.
   * @param {string} tokenUrl The endpoint for use in obtaining the token.
   * @param {string} clientId The client ID representing the application.
   * @param {string} clientSecret The client secret.
   * @param {string=} opt_scope Space-delimited set of scopes.
   * @return {!OAuth2UrlFetchApp} The object for making authenticated requests.
   */
  function withClientCredentials(tokenUrl, clientId, clientSecret, opt_scope) {
    var authHeader =
        'Basic ' + Utilities.base64Encode([clientId, clientSecret].join(':'));
    var payload = {
      grant_type: 'client_credentials',
      client_id: clientId,
      client_secret: clientSecret
    };
    var accessToken = authenticate_(tokenUrl, payload, authHeader, opt_scope);
    return new OAuth2UrlFetchApp(accessToken);
  }

  /**
   * Creates a OAuth2UrlFetchApp object having authenticated with OAuth2 username
   * and password.
   * @param {string} tokenUrl The endpoint for use in obtaining the token.
   * @param {string} clientId The client ID representing the application.
   * @param {string} username OAuth2 Username
   * @param {string} password OAuth2 password
   * @param {string=} opt_scope Space-delimited set of scopes.
   * @return {!OAuth2UrlFetchApp} The object for making authenticated requests.
   */
  function withPassword(tokenUrl, clientId, username, password, opt_scope) {
    var payload = {
      grant_type: 'password',
      client_id: clientId,
      username: username,
      password: password
    };
    var accessToken = authenticate_(tokenUrl, payload, null, opt_scope);
    return new OAuth2UrlFetchApp(accessToken);
  }

  /**
   * Creates a OAuth2UrlFetchApp object having authenticated as a Service
   * Account.
   * Flow details taken from:
   *     https://developers.google.com/identity/protocols/OAuth2ServiceAccount
   * @param {string} tokenUrl The endpoint for use in obtaining the token.
   * @param {string} serviceAccount The email address of the Service Account.
   * @param {string} key The key taken from the downloaded JSON file.
   * @param {string} scope Space-delimited set of scopes.
   * @return {!OAuth2UrlFetchApp} The object for making authenticated requests.
   */
  function withServiceAccount(tokenUrl, serviceAccount, key, scope) {
    var assertionTime = new Date();
    var jwtHeader = '{"alg":"RS256","typ":"JWT"}';
    var jwtClaimSet = {
      iss: serviceAccount,
      scope: scope,
      aud: tokenUrl,
      exp: Math.round(assertionTime.getTime() / 1000 + 3600),
      iat: Math.round(assertionTime.getTime() / 1000)
    };
    var jwtAssertion = Utilities.base64EncodeWebSafe(jwtHeader) + '.' +
        Utilities.base64EncodeWebSafe(JSON.stringify(jwtClaimSet));
    var signature = Utilities.computeRsaSha256Signature(jwtAssertion, key);
    jwtAssertion += '.' + Utilities.base64Encode(signature);
    var payload = {
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwtAssertion
    };
    var accessToken = authenticate_(tokenUrl, payload, null);
    return new OAuth2UrlFetchApp(accessToken);
  }

  scope.OAuth2 = {
    withRefreshToken: withRefreshToken,
    withClientCredentials: withClientCredentials,
    withServiceAccount: withServiceAccount,
    withPassword: withPassword
  };
})(this);