interface WeatherCondition {
	text: string
	icon: string
}

interface ForecastDay {
	date: string
	day: {
		maxtemp_f: number
		mintemp_f: number
		daily_chance_of_rain: number
		condition: WeatherCondition
	}
	astro: {
		sunrise: string
		sunset: string
	}
}

interface WeatherData {
	current: {
		condition: WeatherCondition
		humidity: number
		temp_f: number
		feelslike_f: number
		wind_mph: number
		wind_dir: string
		gust_mph: number
		pressure_in: number
		vis_miles: number
		uv: number
	}
	location: {
		name: string
		country: string
		region: string
		localtime: string
	}
	forecast: {
		forecastday: ForecastDay[]
	}
}
