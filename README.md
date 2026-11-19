## Weather

Harnessing the power of the WeatherAPI.com API, this app allows you to search for a city and get the current weather conditions.

### Features

- Search for a city and get the current weather conditions
- Responsive design

### Technologies

- React
- Vite
- WeatherAPI.com API
- React-Places-Autocomplete / Google Maps API (optional suggestions)

City search works without Google: type a city (e.g. "Chicago") and press Enter or click **Search**. Google Places only provides optional autocomplete suggestions.

### Installation

1. Clone the repo
   ```sh
   git clone
   ```
2. Install NPM packages
   ```sh
   npm install
   ```
3. Create a .env file in the root directory and add your [weatherapi.com](https://www.weatherapi.com/) API key
   ```JS
   VITE_WEATHER_API_KEY=YOUR_API_KEY
   ```
4. Start the development server
   ```sh
   npm run dev
   ```
5. Open [http://localhost:5173](http://localhost:5173) to view it in the browser
