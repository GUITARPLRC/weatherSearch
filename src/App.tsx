import { useState } from 'react';
import axios from 'axios';
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import './App.css'

function WeatherApp() {
  const [location, setLocation] = useState('');
  const [isLoading, setLoading] = useState(false);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

  const handleClear = () => {
    setLocation('');
    setWeatherData(null);
  }

  const handleChange = (address: string) => {
    setLocation(address);
  };

  const handleSelect = (address: string) => {
    setLoading(true)
    geocodeByAddress(address)
      .then(results => getLatLng(results[0]))
      .then(latLng => {
        const coords = `${latLng.lat},${latLng.lng}`
        axios.get<WeatherData>(`http://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${coords}&days=1&aqi=no&alerts=no`)
          .then(response => {
            setWeatherData(response.data);
          })
          .catch(error => {
            console.error('Weather Error', error);
          });
      })
      .catch(error => {
        console.error('Location Error', error);
      })
      .then(() => {
        setTimeout(() => {
          setLocation('')
          setLoading(false)
        }, 500)
      })
  };

  console.log({weatherData})

  return (
    <div>
      <div className='container'>

      <h2>Weather Search</h2>
        <PlacesAutocomplete
          value={location}
          onChange={handleChange}
          onSelect={handleSelect}
        >
          {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
            <div>
              <input
                {...getInputProps({
                  placeholder: 'Enter location',
                  className: 'location-search-input',
                })}
              />
              <div className="autocomplete-dropdown-container">
                {loading && <div className="loading">Loading...</div>}
                {suggestions.map(suggestion => {
                  const className = suggestion.active ? 'suggestion-item--active' : 'suggestion-item';
                  const style = suggestion.active
                    ? { backgroundColor: '#999', cursor: 'pointer' }
                    : { backgroundColor: '#777', cursor: 'pointer' };
                  return (
                    <div
                      {...getSuggestionItemProps(suggestion, {
                        className,
                        style,
                      })}
                    >
                      <span className="suggestion-description">{suggestion.description}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </PlacesAutocomplete>
        <button onClick={handleClear}>Clear</button>
      </div>
      {isLoading && ( <p>Loading</p>)}
      {!isLoading && weatherData && (
        <div className="weather-data">
          <h2 className="weather-data__title">Current Weather in {weatherData.location.name}, {weatherData.location.region}</h2>
          <p className="weather-data__temperature">Temperature: {weatherData.current.temp_f}°F</p>
          <p className="weather-data__humidity">Humidity: {weatherData.current.humidity}%</p>
          <p className="weather-data__wind-speed">Wind Speed: {weatherData.current.wind_mph}mph</p>
          <p className="weather-data__description">Description: {weatherData.current.condition.text}</p>
        </div>
      )}
    </div>
  );
}

export default WeatherApp;
