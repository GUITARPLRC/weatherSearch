import { useState } from 'react';
import axios from 'axios';
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import Clock from './components/Clock';
import SlideShow from './components/SlideShow';
import Ticker from './components/Ticker';
import './App.css'

function WeatherApp() {
  const [location, setLocation] = useState('');
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

  const handleClear = () => {
    setLocation('');
    setWeatherData(null);
    setError(null);
  }

  const handleChange = (address: string) => {
    setLocation(address);
  };

  const handleSelect = async (address: string) => {
    setLoading(true);
    setError(null);
    try {
      const results = await geocodeByAddress(address);
      const latLng = await getLatLng(results[0]);
      const coords = `${latLng.lat},${latLng.lng}`;
      const response = await axios.get<WeatherData>(
        `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${encodeURIComponent(coords)}&days=3&aqi=no&alerts=no`,
      );
      setWeatherData(response.data);
    } catch (err) {
      console.error('Weather lookup failed', err);
      setWeatherData(null);
      setError('We are unable to retrieve weather for that location. Please try again.');
    } finally {
      setLocation('');
      setLoading(false);
    }
  };

  return (
    <div className="broadcast">
      <header className="broadcast__header">
        <h1 className="broadcast__title">Local Weather Report</h1>
        <Clock />
      </header>

      <div className="container search">
        <PlacesAutocomplete
          value={location}
          onChange={handleChange}
          onSelect={handleSelect}
        >
          {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
            <div className="search__box">
              <input
                {...getInputProps({
                  placeholder: 'Enter location',
                  className: 'location-search-input',
                })}
              />
              <div className="autocomplete-dropdown-container">
                {loading && <div className="loading">Searching...</div>}
                {suggestions.map(suggestion => {
                  const className = suggestion.active ? 'suggestion-item suggestion-item--active' : 'suggestion-item';
                  return (
                    <div {...getSuggestionItemProps(suggestion, { className })}>
                      <span className="suggestion-description">{suggestion.description}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </PlacesAutocomplete>
        <button type="button" onClick={handleClear}>Clear</button>
      </div>

      <main className="container">
        {isLoading && (
          <div className="panel panel--status">
            <p className="blink">Receiving Local Data...</p>
          </div>
        )}
        {!isLoading && error && (
          <div className="panel panel--error" role="alert">
            <h2 className="slide__title">Technical Difficulties</h2>
            <p>{error}</p>
          </div>
        )}
        {!isLoading && !error && weatherData && (
          <SlideShow key={weatherData.location.localtime + weatherData.location.name} data={weatherData} />
        )}
        {!isLoading && !error && !weatherData && (
          <div className="panel panel--status">
            <p>Enter a city to see your local forecast.</p>
          </div>
        )}
      </main>

      <Ticker data={weatherData} />
    </div>
  );
}

export default WeatherApp;
