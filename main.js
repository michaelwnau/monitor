const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const config = require('./src/main/config');
const hackerNews = require('./src/main/feeds/hackernews');
const reddit = require('./src/main/feeds/reddit');
const apNews = require('./src/main/feeds/apnews');
const weather = require('./src/main/feeds/weather');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true
    },
    title: 'Monitor Dashboard'
  });

  mainWindow.loadFile('index.html');

  // Open DevTools in development mode
  if (process.argv.includes('--dev')) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// IPC Handlers for feed data
ipcMain.handle('get-hackernews', async () => {
  try {
    return await hackerNews.getTopStories();
  } catch (error) {
    console.error('Error fetching Hacker News:', error);
    return { error: error.message };
  }
});

ipcMain.handle('get-reddit', async (event, subreddit) => {
  try {
    return await reddit.getSubredditPosts(subreddit);
  } catch (error) {
    console.error('Error fetching Reddit:', error);
    return { error: error.message };
  }
});

ipcMain.handle('get-apnews', async () => {
  try {
    return await apNews.getLatestNews();
  } catch (error) {
    console.error('Error fetching AP News:', error);
    return { error: error.message };
  }
});

ipcMain.handle('get-weather', async (event, city) => {
  try {
    return await weather.getWeather(city);
  } catch (error) {
    console.error('Error fetching weather:', error);
    return { error: error.message };
  }
});

ipcMain.handle('get-config', async () => {
  try {
    return config.getConfig();
  } catch (error) {
    console.error('Error fetching config:', error);
    return { error: error.message };
  }
});

ipcMain.handle('update-config', async (event, newConfig) => {
  try {
    config.updateConfig(newConfig);
    return { success: true };
  } catch (error) {
    console.error('Error updating config:', error);
    return { error: error.message };
  }
});
