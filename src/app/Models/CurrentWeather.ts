import { DateTime } from "luxon";

export interface CurrentWeather {
    temperature: number,
    time: DateTime,
    apparent_temperature: number,
    weather: string,
    icon: string,
    city: string
}