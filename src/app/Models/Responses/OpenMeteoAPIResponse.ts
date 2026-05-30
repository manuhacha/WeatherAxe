export interface OpenMeteoAPIResponse {
    timezone: string,
    current: {
        time: Date,
        temperature_2m: number,
        apparent_temperature: number,
        weather_code: number,
        is_day: boolean
    },
    hourly: {
        time: Date[],
        temperature_2m: number[],
        weather_code: number[],
        precipitation_probability: number[]
    },
    daily: {
        time: Date[],
        weather_code: number[],
        temperature_2m_max: number[],
        temperature_2m_min: number[]
    }
}