import { showLoading, clearContainer } from './ui.js';

let clockCities = [];
let clockIntervals = [];

export function initClock(config) {
  // Initialize with default cities or from config
  clockCities = config.clockCities || [
    { name: 'New York', timezone: 'America/New_York' },
    { name: 'London', timezone: 'Europe/London' },
    { name: 'Tokyo', timezone: 'Asia/Tokyo' },
    { name: 'Sydney', timezone: 'Australia/Sydney' }
  ];
  
  renderClocks();
  startClockUpdates();
  
  // Set up add clock button
  const addClockBtn = document.getElementById('add-clock');
  if (addClockBtn) {
    addClockBtn.addEventListener('click', handleAddClock);
  }
  
  // Listen for refresh events
  window.addEventListener('refresh-clocks', () => {
    renderClocks();
  });
  
  console.log('Clock initialized with cities:', clockCities);
}

function renderClocks() {
  const container = document.getElementById('clocks-container');
  if (!container) return;
  
  clearContainer('clocks-container');
  
  clockCities.forEach((city, index) => {
    const clockDiv = document.createElement('div');
    clockDiv.className = 'clock-card';
    clockDiv.setAttribute('data-index', index);
    
    clockDiv.innerHTML = `
      <div class="clock-header">
        <h3 class="clock-city">${city.name}</h3>
        <button class="btn-remove" data-index="${index}">×</button>
      </div>
      <div class="clock-time" id="clock-${index}">--:--:--</div>
      <div class="clock-date" id="date-${index}">----</div>
    `;
    
    container.appendChild(clockDiv);
    
    // Add remove event listener
    const removeBtn = clockDiv.querySelector('.btn-remove');
    removeBtn.addEventListener('click', () => removeClock(index));
  });
  
  updateAllClocks();
}

function startClockUpdates() {
  // Clear existing intervals
  clockIntervals.forEach(interval => clearInterval(interval));
  clockIntervals = [];
  
  // Update every second
  const interval = setInterval(updateAllClocks, 1000);
  clockIntervals.push(interval);
}

function updateAllClocks() {
  clockCities.forEach((city, index) => {
    updateClock(index, city.timezone);
  });
}

function updateClock(index, timezone) {
  const timeEl = document.getElementById(`clock-${index}`);
  const dateEl = document.getElementById(`date-${index}`);
  
  if (!timeEl || !dateEl) return;
  
  try {
    const now = new Date();
    
    const timeStr = now.toLocaleTimeString('en-US', {
      timeZone: timezone,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
    
    const dateStr = now.toLocaleDateString('en-US', {
      timeZone: timezone,
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
    
    timeEl.textContent = timeStr;
    dateEl.textContent = dateStr;
  } catch (error) {
    console.error(`Error updating clock for ${timezone}:`, error);
    timeEl.textContent = 'Error';
    dateEl.textContent = 'Invalid timezone';
  }
}

function handleAddClock() {
  const cityName = prompt('Enter city name:');
  if (!cityName) return;
  
  const timezone = prompt('Enter timezone (e.g., America/Los_Angeles):');
  if (!timezone) return;
  
  clockCities.push({ name: cityName, timezone: timezone });
  
  // Save to config
  window.api.updateConfig({ clockCities }).catch(err => {
    console.error('Error saving clock cities:', err);
  });
  
  renderClocks();
  startClockUpdates();
}

function removeClock(index) {
  clockCities.splice(index, 1);
  
  // Save to config
  window.api.updateConfig({ clockCities }).catch(err => {
    console.error('Error saving clock cities:', err);
  });
  
  renderClocks();
  startClockUpdates();
}
