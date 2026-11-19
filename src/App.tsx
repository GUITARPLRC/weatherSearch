import { useRef, useState } from 'react';
import axios from 'axios';
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import Clock from './components/Clock';
import SlideShow from './components/SlideShow';
import Ticker from './components/Ticker';
import './App.css'

const GENERIC_ERROR = 'We are unable to retrieve weather for that location. Please try again.';

type WeatherApiErrorBody = { error?: { code?: number; message?: string } };

function WeatherApp() {
  const [location, setLocation] = useState('');
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const inFlight = useRef<boolean>(false);
  const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

  const placesAvailable =
    typeof window !== 'undefined' &&
    !!(window as unknown as { google?: { maps?: { places?: unknown } } }).google?.maps?.places;

  const handleClear = () => {
    setLocation('');
    setWeatherData(null);
    setError(null);
  }

  const handleChange = (address: string) => {
    setLocation(address);
  };

  const fetchWeather = async (query: string) => {
    const q = query.trim();
    if (!q || inFlight.current) return;
    if (!API_KEY) {
      setError('Weather API key is not configured (VITE_WEATHER_API_KEY).');
      return;
    }
    inFlight.current = true;
    setLoading(true);
    setError(null);
    try {
      const { data } = await axios.get<WeatherData>('https://api.weatherapi.com/v1/forecast.json', {
        params: { key: API_KEY, q, days: 3, aqi: 'no', alerts: 'no' },
      });
      setWeatherData(data);
      setLocation('');
    } catch (err) {
      console.error('Weather lookup failed', err);
      setWeatherData(null);
      let message = GENERIC_ERROR;
      if (axios.isAxiosError(err)) {
        const status = err.response?.status;
        const code = (err.response?.data as WeatherApiErrorBody | undefined)?.error?.code;
        if (code === 1006 || status === 400) {
          message = `No location found matching "${q}".`;
        } else if (status === 401 || status === 403) {
          message = 'Weather service rejected the API key.';
        }
      }
      setError(message);
    } finally {
      setLoading(false);
      inFlight.current = false;
    }
  };

  const handleSelect = async (address: string, placeId?: string | null) => {
    if (!placeId) {
      await fetchWeather(address);
      return;
    }
    let query = address;
    try {
      const results = await geocodeByAddress(address);
      const latLng = await getLatLng(results[0]);
      query = `${latLng.lat},${latLng.lng}`;
    } catch (err) {
      console.warn('Geocoding failed, falling back to text search', err);
    }
    await fetchWeather(query);
  };

  return (
    <div className="broadcast">
      <header className="broadcast__header">
        <h1 className="broadcast__title">Local Weather Report</h1>
        <Clock />
      </header>

      <form
        className="container search"
        onSubmit={e => {
          e.preventDefault();
          fetchWeather(location);
        }}
      >
        {placesAvailable ? (
          <PlacesAutocomplete
            value={location}
            onChange={handleChange}
            onSelect={handleSelect}
            onError={(status, clearSuggestions) => {
              console.warn('Places autocomplete unavailable:', status);
              clearSuggestions();
            }}
            shouldFetchSuggestions={location.trim().length > 2}
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
        ) : (
          <div className="search__box">
            <input
              className="location-search-input"
              placeholder="Enter location"
              value={location}
              onChange={e => setLocation(e.target.value)}
            />
          </div>
        )}
        <button type="submit" disabled={isLoading}>Search</button>
        <button type="button" onClick={handleClear}>Clear</button>
      </form>

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
