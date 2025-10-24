const fs = require('fs');
const path = require('path');

const CONFIG_DIR = path.join(__dirname, '../../config');
const DEFAULT_CONFIG_PATH = path.join(CONFIG_DIR, 'default.json');
const USER_CONFIG_PATH = path.join(CONFIG_DIR, 'user.json');

let currentConfig = null;

function loadDefaultConfig() {
  try {
    const data = fs.readFileSync(DEFAULT_CONFIG_PATH, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading default config:', error);
    return getHardcodedDefaults();
  }
}

function loadUserConfig() {
  try {
    if (fs.existsSync(USER_CONFIG_PATH)) {
      const data = fs.readFileSync(USER_CONFIG_PATH, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error loading user config:', error);
  }
  return {};
}

function getHardcodedDefaults() {
  return {
    theme: 'light',
    defaultNewsFeed: 'hackernews',
    defaultSubreddit: 'programming',
    weatherCity: 'London',
    clockCities: [
      { name: 'New York', timezone: 'America/New_York' },
      { name: 'London', timezone: 'Europe/London' },
      { name: 'Tokyo', timezone: 'Asia/Tokyo' },
      { name: 'Sydney', timezone: 'Australia/Sydney' }
    ],
    refreshInterval: 300000 // 5 minutes
  };
}

function getConfig() {
  if (!currentConfig) {
    const defaults = loadDefaultConfig();
    const userConfig = loadUserConfig();
    currentConfig = { ...defaults, ...userConfig };
  }
  return currentConfig;
}

function updateConfig(newConfig) {
  try {
    const config = getConfig();
    currentConfig = { ...config, ...newConfig };
    
    // Ensure config directory exists
    if (!fs.existsSync(CONFIG_DIR)) {
      fs.mkdirSync(CONFIG_DIR, { recursive: true });
    }
    
    // Save to user config file
    fs.writeFileSync(USER_CONFIG_PATH, JSON.stringify(currentConfig, null, 2));
    
    console.log('Configuration updated');
  } catch (error) {
    console.error('Error updating config:', error);
    throw error;
  }
}

module.exports = {
  getConfig,
  updateConfig
};
