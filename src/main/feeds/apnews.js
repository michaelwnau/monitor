const Parser = require('rss-parser');

const parser = new Parser();
const AP_NEWS_RSS = 'https://rsshub.app/apnews/topics/apf-topnews';

async function getLatestNews(limit = 10) {
  try {
    const feed = await parser.parseURL(AP_NEWS_RSS);
    
    if (!feed || !feed.items) {
      throw new Error('Invalid RSS feed response');
    }
    
    const articles = feed.items.slice(0, limit).map(item => ({
      title: item.title,
      link: item.link,
      pubDate: item.pubDate,
      contentSnippet: item.contentSnippet,
      content: item.content
    }));
    
    return { articles };
  } catch (error) {
    console.error('Error fetching AP News RSS:', error.message);
    throw new Error('Failed to fetch AP News RSS feed');
  }
}

module.exports = {
  getLatestNews
};
