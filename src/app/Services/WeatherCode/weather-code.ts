import { Injectable } from '@angular/core';
import { Weather } from '../../Models/Weather';

@Injectable({
  providedIn: 'root',
})
export class WeatherCode {
  
getWeatherCode(code: number): Weather {
  
  if (code === 0) {
    return { weather: 'Clear', icon: 'wi-day-sunny' } ;
  }
  
  if (code === 61 || code === 63 || code === 65) {
    return { weather: 'Rain', icon: 'wi-day-rain' }
  }

  return { weather: '', icon: '' };

}

}
