import { Injectable } from '@angular/core';
import { Weather } from '../../Models/Weather';

@Injectable({
  providedIn: 'root',
})
export class WeatherCode {
  
//Servicio para retornar el tiempo y el icono en funcion del código de clima de la api
getWeatherCode(code: number, isDay: Boolean): Weather {
  switch (code) {
    case 0:
      return { weather: 'Clear', icon: isDay ? 'wi-day-sunny' : 'wi-night-clear' };
    case 1:
      return { weather: 'Mainly clear', icon: isDay ? 'wi-day-sunny' : 'wi-night-clear' };
    case 2:
      return {  weather: 'Partly cloudy', icon: isDay ? 'wi-day-cloudy' : 'wi-night-alt-cloudy' };
    case 3: 
      return {  weather: 'Cloudy', icon: 'wi-cloudy' };
    case 45:
      return {  weather: 'Fog', icon: isDay ? 'wi-day-fog' : 'wi-night-fog' };
    case 48:
      return {  weather: 'Depositing rime fog', icon: isDay ? 'wi-day-fog' : 'wi-night-fog' };
    case 51:
      return {  weather: 'Light drizzle', icon: isDay ? 'wi-day-sprinkle' : 'wi-night-alt-sprinkle' };
    case 53:
      return {  weather: 'Moderate drizzle', icon: isDay ? 'wi-day-sprinkle' : 'wi-night-alt-sprinkle' };
    case 55:
      return {  weather: 'Dense drizzle', icon: isDay ? 'wi-day-sprinkle' : 'wi-night-alt-sprinkle' };
    case 56:
      return {  weather: 'Light freezing drizzle', icon: isDay ? 'wi-day-sleet' : 'wi-night-alt-sleet' };
    case 57:
      return {  weather: 'Dense freezing drizzle', icon: isDay ? 'wi-day-sleet' : 'wi-night-alt-sleet' };
    case 61: 
      return {  weather: 'Slight rain', icon: isDay ? 'wi-day-rain' : 'wi-night-alt-rain' };
    case 63: 
      return {  weather: 'Moderate rain', icon: isDay ? 'wi-day-rain' : 'wi-night-alt-rain' };
    case 65: 
      return {  weather: 'Heavy rain', icon: isDay ? 'wi-day-rain' : 'wi-night-alt-rain' };
    case 66: 
      return {  weather: 'Light freezing rain', icon: isDay ? 'wi-day-rain-mix' : 'wi-night-alt-rain-mix' };
    case 67: 
      return {  weather: 'Heavy freezing rain', icon: isDay ? 'wi-day-rain-mix' : 'wi-night-alt-rain-mix' };
    case 71: 
      return {  weather: 'Slight snow fall', icon: isDay ? 'wi-day-snow' : 'wi-night-alt-snow' };
    case 73: 
      return {  weather: 'Moderate snow fall', icon: isDay ? 'wi-day-snow' : 'wi-night-alt-snow' };
    case 75: 
      return {  weather: 'Heavy snow fall', icon: isDay ? 'wi-day-snow' : 'wi-night-alt-snow' };
    case 77: 
      return {  weather: 'Snow grains', icon: isDay ? 'wi-day-snow' : 'wi-night-alt-snow' };
    case 80: 
      return {  weather: 'Slight rain showers', icon: isDay ? 'wi-day-showers' : 'wi-night-alt-showers' };
    case 81: 
      return {  weather: 'Moderate rain showers', icon: isDay ? 'wi-day-showers' : 'wi-night-alt-showers' };
    case 82: 
      return {  weather: 'Violent rain showers', icon: isDay ? 'wi-day-showers' : 'wi-night-alt-showers' };
    case 85: 
      return {  weather: 'Slight snow showers', icon: isDay ? 'wi-day-snow' : 'wi-night-alt-snow' };
    case 86: 
      return {  weather: 'Heavy snow showers', icon: isDay ? 'wi-day-snow' : 'wi-night-alt-snow' };
    case 95: 
      return { weather: 'Thunderstorm', icon: isDay ? 'wi-day-thunderstorm' : 'wi-night-alt-thunderstorm' }
    case 96:
      return { weather: 'Thunderstorm with slight hail', icon: isDay ? 'wi-day-thunderstorm' : 'wi-night-alt-thunderstorm' }
    case 99:
      return { weather: 'Thunderstorm with heavy hail', icon: isDay ? 'wi-day-thunderstorm' : 'wi-night-alt-thunderstorm' }
  }
  return { weather: '', icon: '' };
}

}
