# Monitor Dashboard

A desktop monitoring application built with Electron that displays:
- **World Clock** - Track time across multiple timezones
- **Weather** - Current weather information for any city
- **News Feeds** - Latest stories from Hacker News, Reddit, and AP News

## Features

- 🌍 **World Clock**: Add and track time in multiple cities worldwide
- ☀️ **Weather**: Get current weather data (temperature, humidity, wind speed)
- 📰 **News Feeds**: Browse top stories from:
  - Hacker News
  - Reddit (customizable subreddits)
  - AP News
- 🎨 **Theme Toggle**: Switch between light and dark themes
- 🔄 **Auto-refresh**: Keep all data up-to-date
- ⚙️ **Persistent Configuration**: Your preferences are saved automatically

## Installation

1. Install dependencies:
```bash
npm install
```

2. (Optional) Set up OpenWeatherMap API key for real weather data:
```bash
export OPENWEATHER_API_KEY=your_api_key_here
```

Without an API key, the weather module will use demo data.

## Usage

### Development Mode (with DevTools)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

## Project Structure

```
monitor/
├── package.json
├── main.js                     # Electron main process
├── preload.js                  # Secure preload script
├── index.html                  # Main window HTML
├── src/
│   ├── renderer/
│   │   ├── renderer.js         # Frontend logic
│   │   ├── ui.js               # UI management
│   │   ├── clock.js            # World clock logic
│   │   ├── weather.js          # Weather display
│   │   └── news.js             # News feed handlers
│   ├── main/
│   │   ├── feeds/
│   │   │   ├── hackernews.js   # Hacker News API
│   │   │   ├── reddit.js       # Reddit API
│   │   │   ├── apnews.js       # AP News RSS
│   │   │   └── weather.js      # OpenWeatherMap API
│   │   └── config.js           # Configuration manager
│   └── styles/
│       ├── main.css            # Primary stylesheet
│       ├── layout.css          # Grid and pane layouts
│       └── themes.css          # Color schemes
├── assets/
│   └── fonts/                  # Local font cache
└── config/
    └── default.json            # Default settings
```

## Configuration

The application stores configuration in `config/user.json` (auto-created).

Default settings include:
- Theme preference (light/dark)
- Default news feed
- Default subreddit
- Weather city
- Clock cities and timezones
- Refresh interval

## Technologies Used

- **Electron** - Desktop application framework
- **Axios** - HTTP client for API requests
- **RSS Parser** - For parsing news feeds
- **Native CSS Grid** - Responsive layout

## License

MIT