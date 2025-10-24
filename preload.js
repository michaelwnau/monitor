const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('api', {
  // Feed APIs
  getHackerNews: () => ipcRenderer.invoke('get-hackernews'),
  getReddit: (subreddit) => ipcRenderer.invoke('get-reddit', subreddit),
  getAPNews: () => ipcRenderer.invoke('get-apnews'),
  getWeather: (city) => ipcRenderer.invoke('get-weather', city),
  
  // Config APIs
  getConfig: () => ipcRenderer.invoke('get-config'),
  updateConfig: (config) => ipcRenderer.invoke('update-config', config)
});
