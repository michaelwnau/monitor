const axios = require('axios');

const BASE_URL = 'https://hacker-news.firebaseio.com/v0';

async function getTopStories(limit = 10) {
  try {
    // Get top story IDs
    const response = await axios.get(`${BASE_URL}/topstories.json`);
    const storyIds = response.data.slice(0, limit);
    
    // Fetch story details for each ID
    const storyPromises = storyIds.map(id => 
      axios.get(`${BASE_URL}/item/${id}.json`)
        .then(res => res.data)
        .catch(err => {
          console.error(`Error fetching story ${id}:`, err.message);
          return null;
        })
    );
    
    const stories = await Promise.all(storyPromises);
    
    // Filter out any null values from failed requests
    const validStories = stories.filter(story => story !== null);
    
    return { stories: validStories };
  } catch (error) {
    console.error('Error fetching Hacker News stories:', error);
    throw new Error('Failed to fetch Hacker News stories');
  }
}

module.exports = {
  getTopStories
};
