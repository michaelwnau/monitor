const axios = require('axios');

async function getSubredditPosts(subreddit = 'programming', limit = 10) {
  try {
    const url = `https://www.reddit.com/r/${subreddit}/hot.json?limit=${limit}`;
    
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Monitor Dashboard/1.0.0'
      }
    });
    
    if (!response.data || !response.data.data || !response.data.data.children) {
      throw new Error('Invalid Reddit API response');
    }
    
    const posts = response.data.data.children.map(child => {
      const post = child.data;
      return {
        title: post.title,
        url: post.url,
        author: post.author,
        score: post.score,
        num_comments: post.num_comments,
        created: post.created_utc,
        subreddit: post.subreddit
      };
    });
    
    return { posts };
  } catch (error) {
    console.error(`Error fetching Reddit posts from r/${subreddit}:`, error.message);
    throw new Error(`Failed to fetch Reddit posts from r/${subreddit}`);
  }
}

module.exports = {
  getSubredditPosts
};
