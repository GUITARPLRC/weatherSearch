interface TickerProps {
  data: WeatherData | null;
}

function Ticker({ data }: TickerProps) {
  let text = 'WELCOME TO YOUR LOCAL WEATHER REPORT ... ENTER A LOCATION ABOVE TO GET STARTED';

  if (data) {
    const { location, current, forecast } = data;
    const parts = [
      `${location.name}${location.region ? `, ${location.region}` : ''}`,
      `NOW ${Math.round(current.temp_f)}°F AND ${current.condition.text}`,
      `WIND ${current.wind_dir} ${Math.round(current.wind_mph)} MPH`,
      `HUMIDITY ${current.humidity}%`,
      ...(forecast?.forecastday ?? []).map(
        d =>
          `${new Date(`${d.date}T12:00:00`).toLocaleDateString('en-US', { weekday: 'long' })}: ${d.day.condition.text}, HIGH ${Math.round(d.day.maxtemp_f)} LOW ${Math.round(d.day.mintemp_f)}`,
      ),
    ];
    text = parts.join('  ...  ');
  }

  return (
    <div className="ticker" role="marquee" aria-label={text}>
      <div className="ticker__track" aria-hidden="true">
        <span>{text}</span>
      </div>
    </div>
  );
}

export default Ticker;
