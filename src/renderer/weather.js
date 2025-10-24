import { showLoading, showError, clearContainer } from './ui.js';

let currentWeatherCity = 'London';

export function initWeather(config) {
  // Set initial city from config
  currentWeatherCity = config.weatherCity || 'London';
  
  // Set up weather search
  const searchBtn = document.getElementById('weather-search');
  const cityInput = document.getElementById('weather-city');
  
  if (searchBtn && cityInput) {
    searchBtn.addEventListener('click', () => {
      const city = cityInput.value.trim();
      if (city) {
        currentWeatherCity = city;
        loadWeather(city);
      }
    });
    
    cityInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        const city = cityInput.value.trim();
        if (city) {
          currentWeatherCity = city;
          loadWeather(city);
        }
      }
    });
    
    cityInput.value = currentWeatherCity;
  }
  
  // Listen for refresh events
  window.addEventListener('refresh-weather', () => {
    loadWeather(currentWeatherCity);
  });
  
  // Load initial weather
  loadWeather(currentWeatherCity);
  
  console.log('Weather initialized with city:', currentWeatherCity);
}

async function loadWeather(city) {
  const container = document.getElementById('weather-container');
  if (!container) return;
  
  showLoading('weather-container');
  
  try {
    const weatherData = await window.api.getWeather(city);
    
    if (weatherData.error) {
      showError('weather-container', weatherData.error);
      return;
    }
    
    renderWeather(weatherData);
    
    // Save city preference
    window.api.updateConfig({ weatherCity: city }).catch(err => {
      console.error('Error saving weather city:', err);
    });
    
    console.log('Weather loaded for:', city);
  } catch (error) {
    console.error('Error loading weather:', error);
    showError('weather-container', error.message || 'Failed to load weather data');
  }
}

function renderWeather(data) {
  const container = document.getElementById('weather-container');
  if (!container) return;
  
  clearContainer('weather-container');
  
  const weatherCard = document.createElement('div');
  weatherCard.className = 'weather-card';
  
  const mockWarning = data.mock ? '<div style="color: var(--text-secondary); font-size: 0.75rem; margin-bottom: 0.5rem;">(Demo data - set OPENWEATHER_API_KEY for real data)</div>' : '';
  
  weatherCard.innerHTML = `
    ${mockWarning}
    <div class="weather-location">
      ${data.city}, ${data.country}
    </div>
    <div class="weather-main">
      <div class="weather-temp">${data.temperature}°C</div>
      <div>
        <div class="weather-description">${data.description}</div>
        <div style="font-size: 0.875rem; color: var(--text-secondary);">
          Feels like ${data.feels_like}°C
        </div>
      </div>
    </div>
    <div class="weather-details">
      <div>
        <strong>Humidity:</strong> ${data.humidity}%
      </div>
      <div>
        <strong>Wind:</strong> ${data.wind_speed} m/s
      </div>
    </div>
  `;
  
  container.appendChild(weatherCard);
}
