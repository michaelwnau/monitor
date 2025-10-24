let currentTheme = 'light';

export function initUI(config) {
  // Set initial theme
  currentTheme = config.theme || 'light';
  document.body.setAttribute('data-theme', currentTheme);
  
  // Theme toggle
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
  }
  
  // Refresh all button
  const refreshAll = document.getElementById('refresh-all');
  if (refreshAll) {
    refreshAll.addEventListener('click', handleRefreshAll);
  }
  
  console.log('UI initialized with theme:', currentTheme);
}

function toggleTheme() {
  currentTheme = currentTheme === 'light' ? 'dark' : 'light';
  document.body.setAttribute('data-theme', currentTheme);
  
  // Save theme preference
  window.api.updateConfig({ theme: currentTheme }).catch(err => {
    console.error('Error saving theme:', err);
  });
  
  console.log('Theme toggled to:', currentTheme);
}

async function handleRefreshAll() {
  console.log('Refreshing all feeds...');
  
  // Trigger refresh events
  window.dispatchEvent(new CustomEvent('refresh-clocks'));
  window.dispatchEvent(new CustomEvent('refresh-weather'));
  window.dispatchEvent(new CustomEvent('refresh-news'));
  
  // Update last refreshed time
  const lastUpdatedEl = document.getElementById('last-updated');
  if (lastUpdatedEl) {
    const now = new Date();
    lastUpdatedEl.textContent = `Last updated: ${now.toLocaleTimeString()}`;
  }
}

export function showLoading(containerId) {
  const container = document.getElementById(containerId);
  if (container) {
    container.innerHTML = '<div class="loading">Loading...</div>';
  }
}

export function showError(containerId, message) {
  const container = document.getElementById(containerId);
  if (container) {
    container.innerHTML = `<div class="error">Error: ${message}</div>`;
  }
}

export function clearContainer(containerId) {
  const container = document.getElementById(containerId);
  if (container) {
    container.innerHTML = '';
  }
}
