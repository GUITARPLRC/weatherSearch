interface WeatherData {
	current: {
		condition: {
			text: string
		}
		humidity: number
		temp_f: number
		wind_mph: number
	}
	location: {
		name: string
		country: string
		region: string
	}
}
