# generates lists of user ids of twitter users who have liked or retweeted your
# 20 or 200 most recent tweets
# output to be copy/pasted into Code.gs


# retrieve ids of recent tweets using get20MostRecentTweetIDs and get200MostRecentTweetIDs
# in Code.gs, then copy/paste them here
# (see instructions at the top of Code.gs)
last200_post_ids = [00000000000000]
last20_post_ids = [00000000000000]


# modified from https://stackoverflow.com/a/37239790
import urllib2
import re

# metric = 'favorited' or 'retweeted'
def get_user_ids_of_post_engagements(post_id, metric):
    try:
        json_data = urllib2.urlopen('https://twitter.com/i/activity/' + metric +'_popup?id=' + str(post_id)).read()
        found_ids = re.findall(r'data-user-id=\\"+\d+', json_data)
        unique_ids = list(set([re.findall(r'\d+', match)[0] for match in found_ids]))
        return unique_ids
    except urllib2.HTTPError:
        return False

# metric = 'favorited' or 'retweeted'
def get_user_ids_of_posts_engagements(post_ids, metric):
    try:
        found_ids = []
	for post_id in post_ids:
		found_ids.extend(get_user_ids_of_post_engagements(post_id, metric))
        return found_ids
    except urllib2.HTTPError:
        return False

print "USERS WHO LIKED LAST 20 POSTS (non-unique)"
print get_user_ids_of_posts_engagements(last20_post_ids, 'favorited')
print ""
print "USERS WHO LIKED LAST 200 POSTS (non-unique)"
print get_user_ids_of_posts_engagements(last200_post_ids, 'favorited')
print ""
print "USERS WHO RETWEETED LAST 20 POSTS (non-unique)"
print get_user_ids_of_posts_engagements(last20_post_ids, 'retweeted')
print ""
print "USERS WHO RETWEETED LAST 200 POSTS (non-unique)"
print get_user_ids_of_posts_engagements(last200_post_ids, 'retweeted')

