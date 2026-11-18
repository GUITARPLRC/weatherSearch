import { useEffect, useState } from 'react';

interface SlideShowProps {
  data: WeatherData;
}

const SLIDE_COUNT = 3;
const SLIDE_MS = 8000;

const iconUrl = (icon: string) => (icon.startsWith('//') ? `https:${icon}` : icon);

const dayName = (date: string) =>
  new Date(`${date}T12:00:00`).toLocaleDateString('en-US', { weekday: 'short' });

function SlideShow({ data }: SlideShowProps) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  // Restart the rotation timer whenever the data changes or the user navigates.
  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setIndex(i => (i + 1) % SLIDE_COUNT), SLIDE_MS);
    return () => clearInterval(id);
  }, [paused, data, index]);

  const { current, location, forecast } = data;
  const days = forecast?.forecastday ?? [];
  const today = days[0];

  const slides = [
    <section className="slide" key="current">
      <h2 className="slide__title">Current Conditions</h2>
      <div className="slide__subtitle">{location.name}{location.region ? `, ${location.region}` : ''}</div>
      <div className="current">
        <div className="current__main">
          <div className="current__temp">{Math.round(current.temp_f)}°</div>
          {current.condition.icon && (
            <img className="current__icon" src={iconUrl(current.condition.icon)} alt="" />
          )}
          <div className="current__cond">{current.condition.text}</div>
        </div>
        <dl className="readout">
          <dt>Feels Like</dt><dd>{Math.round(current.feelslike_f)}°F</dd>
          <dt>Humidity</dt><dd>{current.humidity}%</dd>
          <dt>Wind</dt><dd>{current.wind_dir} {Math.round(current.wind_mph)} mph</dd>
          <dt>Gusts</dt><dd>{Math.round(current.gust_mph)} mph</dd>
          <dt>Pressure</dt><dd>{current.pressure_in} in</dd>
          <dt>Visibility</dt><dd>{current.vis_miles} mi</dd>
          <dt>UV Index</dt><dd>{current.uv}</dd>
        </dl>
      </div>
    </section>,
    <section className="slide" key="today">
      <h2 className="slide__title">Today's Forecast</h2>
      <div className="slide__subtitle">{location.name}</div>
      {today ? (
        <dl className="readout readout--wide">
          <dt>High</dt><dd>{Math.round(today.day.maxtemp_f)}°F</dd>
          <dt>Low</dt><dd>{Math.round(today.day.mintemp_f)}°F</dd>
          <dt>Conditions</dt><dd>{today.day.condition.text}</dd>
          <dt>Chance of Rain</dt><dd>{today.day.daily_chance_of_rain}%</dd>
          <dt>Sunrise</dt><dd>{today.astro.sunrise}</dd>
          <dt>Sunset</dt><dd>{today.astro.sunset}</dd>
        </dl>
      ) : (
        <p className="slide__empty">Forecast unavailable</p>
      )}
    </section>,
    <section className="slide" key="extended">
      <h2 className="slide__title">Extended Forecast</h2>
      <div className="slide__subtitle">{location.name}</div>
      <div className="extended">
        {days.map(d => (
          <div className="extended__day" key={d.date}>
            <div className="extended__name">{dayName(d.date)}</div>
            {d.day.condition.icon && (
              <img className="extended__icon" src={iconUrl(d.day.condition.icon)} alt="" />
            )}
            <div className="extended__cond">{d.day.condition.text}</div>
            <div className="extended__temps">
              <span className="extended__hi">{Math.round(d.day.maxtemp_f)}</span>
              <span className="extended__lo">{Math.round(d.day.mintemp_f)}</span>
            </div>
          </div>
        ))}
      </div>
    </section>,
  ];

  const safeIndex = index % SLIDE_COUNT;

  return (
    <div className="slideshow">
      <div className="panel">{slides[safeIndex]}</div>
      <div className="slideshow__controls">
        <button type="button" onClick={() => setIndex(i => (i + SLIDE_COUNT - 1) % SLIDE_COUNT)}>
          ◄ Prev
        </button>
        <button type="button" onClick={() => setPaused(p => !p)}>
          {paused ? '► Play' : '❚❚ Pause'}
        </button>
        <button type="button" onClick={() => setIndex(i => (i + 1) % SLIDE_COUNT)}>
          Next ►
        </button>
      </div>
    </div>
  );
}

export default SlideShow;
