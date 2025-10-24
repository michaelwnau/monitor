const axios = require('axios');

// Note: This uses OpenWeatherMap API. You need to set OPENWEATHER_API_KEY environment variable
// or the app will use a demo mode with mock data
const API_KEY = process.env.OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

async function getWeather(city = 'London') {
  try {
    if (!API_KEY) {
      // Return mock data if no API key is set
      return getMockWeather(city);
    }
    
    const response = await axios.get(BASE_URL, {
      params: {
        q: city,
        appid: API_KEY,
        units: 'metric'
      }
    });
    
    const data = response.data;
    
    return {
      city: data.name,
      country: data.sys.country,
      temperature: Math.round(data.main.temp),
      feels_like: Math.round(data.main.feels_like),
      humidity: data.main.humidity,
      description: data.weather[0].description,
      icon: data.weather[0].icon,
      wind_speed: data.wind.speed
    };
  } catch (error) {
    console.error(`Error fetching weather for ${city}:`, error.message);
    
    // Fallback to mock data on error
    if (error.response && error.response.status === 401) {
      return getMockWeather(city);
    }
    
    throw new Error(`Failed to fetch weather for ${city}`);
  }
}

function getMockWeather(city) {
  return {
    city: city,
    country: 'XX',
    temperature: 20,
    feels_like: 18,
    humidity: 65,
    description: 'partly cloudy',
    icon: '02d',
    wind_speed: 5.5,
    mock: true
  };
}

module.exports = {
  getWeather
};
