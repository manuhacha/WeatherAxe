export interface HourlyWeather {
    time: Date,
    weather: string,
    icon: string,
    temperature: number,
    precipitation_probability: number,
    precipitation: number
}