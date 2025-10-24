import { showLoading, showError, clearContainer } from './ui.js';

let currentFeed = 'hackernews';
let currentSubreddit = 'programming';

export function initNews(config) {
  // Set initial feed and subreddit from config
  currentFeed = config.defaultNewsFeed || 'hackernews';
  currentSubreddit = config.defaultSubreddit || 'programming';
  
  // Set up news tab buttons
  const tabButtons = document.querySelectorAll('.tab-btn');
  tabButtons.forEach(btn => {
    btn.addEventListener('click', handleTabClick);
  });
  
  // Load initial news feed
  loadNewsFeed(currentFeed);
  
  // Listen for refresh events
  window.addEventListener('refresh-news', () => {
    loadNewsFeed(currentFeed);
  });
  
  console.log('News initialized with feed:', currentFeed);
}

function handleTabClick(event) {
  const feedType = event.target.getAttribute('data-feed');
  
  // Update active tab
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  event.target.classList.add('active');
  
  currentFeed = feedType;
  loadNewsFeed(feedType);
}

async function loadNewsFeed(feedType) {
  const container = document.getElementById('news-container');
  if (!container) return;
  
  showLoading('news-container');
  
  try {
    let newsData;
    
    switch (feedType) {
      case 'hackernews':
        newsData = await window.api.getHackerNews();
        renderHackerNews(newsData);
        break;
      case 'reddit':
        newsData = await window.api.getReddit(currentSubreddit);
        renderReddit(newsData);
        break;
      case 'apnews':
        newsData = await window.api.getAPNews();
        renderAPNews(newsData);
        break;
      default:
        throw new Error('Unknown feed type');
    }
    
    console.log(`Loaded ${feedType} feed`);
  } catch (error) {
    console.error('Error loading news feed:', error);
    showError('news-container', error.message || 'Failed to load news feed');
  }
}

function renderHackerNews(data) {
  const container = document.getElementById('news-container');
  if (!container) return;
  
  if (data.error) {
    showError('news-container', data.error);
    return;
  }
  
  clearContainer('news-container');
  
  if (!data.stories || data.stories.length === 0) {
    container.innerHTML = '<div class="no-data">No stories available</div>';
    return;
  }
  
  const listEl = document.createElement('div');
  listEl.className = 'news-list';
  
  data.stories.forEach(story => {
    const itemEl = document.createElement('div');
    itemEl.className = 'news-item';
    
    itemEl.innerHTML = `
      <h3 class="news-title">
        <a href="${story.url || `https://news.ycombinator.com/item?id=${story.id}`}" target="_blank">
          ${story.title}
        </a>
      </h3>
      <div class="news-meta">
        <span class="news-points">${story.score || 0} points</span>
        <span class="news-author">by ${story.by || 'unknown'}</span>
        <span class="news-comments">${story.descendants || 0} comments</span>
      </div>
    `;
    
    listEl.appendChild(itemEl);
  });
  
  container.appendChild(listEl);
}

function renderReddit(data) {
  const container = document.getElementById('news-container');
  if (!container) return;
  
  if (data.error) {
    showError('news-container', data.error);
    return;
  }
  
  clearContainer('news-container');
  
  // Add subreddit selector
  const selectorDiv = document.createElement('div');
  selectorDiv.className = 'subreddit-selector';
  
  const input = document.createElement('input');
  input.type = 'text';
  input.id = 'subreddit-input';
  input.value = currentSubreddit;
  input.placeholder = 'Enter subreddit...';
  
  const goBtn = document.createElement('button');
  goBtn.id = 'subreddit-go';
  goBtn.className = 'btn-search';
  goBtn.textContent = 'Go';
  
  selectorDiv.appendChild(input);
  selectorDiv.appendChild(goBtn);
  container.appendChild(selectorDiv);
  
  goBtn.addEventListener('click', () => {
    currentSubreddit = input.value || 'programming';
    loadNewsFeed('reddit');
  });
  
  if (!data.posts || data.posts.length === 0) {
    container.innerHTML += '<div class="no-data">No posts available</div>';
    return;
  }
  
  const listEl = document.createElement('div');
  listEl.className = 'news-list';
  
  data.posts.forEach(post => {
    const itemEl = document.createElement('div');
    itemEl.className = 'news-item';
    
    itemEl.innerHTML = `
      <h3 class="news-title">
        <a href="${post.url}" target="_blank">${post.title}</a>
      </h3>
      <div class="news-meta">
        <span class="news-points">${post.score || 0} points</span>
        <span class="news-author">by u/${post.author || 'unknown'}</span>
        <span class="news-comments">${post.num_comments || 0} comments</span>
      </div>
    `;
    
    listEl.appendChild(itemEl);
  });
  
  container.appendChild(listEl);
}

function renderAPNews(data) {
  const container = document.getElementById('news-container');
  if (!container) return;
  
  if (data.error) {
    showError('news-container', data.error);
    return;
  }
  
  clearContainer('news-container');
  
  if (!data.articles || data.articles.length === 0) {
    container.innerHTML = '<div class="no-data">No articles available</div>';
    return;
  }
  
  const listEl = document.createElement('div');
  listEl.className = 'news-list';
  
  data.articles.forEach(article => {
    const itemEl = document.createElement('div');
    itemEl.className = 'news-item';
    
    itemEl.innerHTML = `
      <h3 class="news-title">
        <a href="${article.link}" target="_blank">${article.title}</a>
      </h3>
      <div class="news-meta">
        <span class="news-date">${article.pubDate || 'Unknown date'}</span>
      </div>
      ${article.contentSnippet ? `<p class="news-snippet">${article.contentSnippet}</p>` : ''}
    `;
    
    listEl.appendChild(itemEl);
  });
  
  container.appendChild(listEl);
}
