import { initUI } from './ui.js';
import { initClock } from './clock.js';
import { initNews } from './news.js';
import { initWeather } from './weather.js';

// Initialize the application
async function init() {
  console.log('Initializing Monitor Dashboard...');
  
  try {
    // Load configuration
    const config = await window.api.getConfig();
    console.log('Configuration loaded:', config);
    
    // Initialize UI components
    initUI(config);
    
    // Initialize world clock
    initClock(config);
    
    // Initialize weather
    initWeather(config);
    
    // Initialize news feeds
    initNews(config);
    
    // Set up refresh interval
    setInterval(() => {
      updateLastRefreshed();
    }, 1000);
    
    console.log('Monitor Dashboard initialized successfully');
  } catch (error) {
    console.error('Error initializing application:', error);
  }
}

function updateLastRefreshed() {
  const lastUpdatedEl = document.getElementById('last-updated');
  if (lastUpdatedEl) {
    const now = new Date();
    lastUpdatedEl.textContent = `Last updated: ${now.toLocaleTimeString()}`;
  }
}

// Wait for DOM to be ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
