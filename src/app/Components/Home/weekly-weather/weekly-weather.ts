import { WeeklyWeatherData } from '../../../Models/WeeklyWeatherData';
import { Component, inject, Input, signal } from '@angular/core';
import { OpenMeteoAPIResponse } from '../../../Models/Responses/OpenMeteoAPIResponse';
import { WeatherCode } from '../../../Services/WeatherCode/weather-code';

@Component({
  selector: 'app-weekly-weather',
  imports: [],
  templateUrl: './weekly-weather.html',
  styleUrl: './weekly-weather.css',
})
export class WeeklyWeather {

  //Creamos nuestro input para que el componente padre envíe datos
  @Input() data:OpenMeteoAPIResponse | null = null;
  //Creamos nuestro array con el tiempo por días
  protected readonly dailyWeather = signal<WeeklyWeatherData[]>([]);
  //Inyectamos nuestro servicio de WeatherCode
  weatherCodeService = inject(WeatherCode);

  ngOnInit() {
    this.loadDaily();
  }

  loadDaily() {
    if (!this.data) return;

    const daily = this.data.daily;

    //Obtenemos el tiempo de los días de la semana
    this.dailyWeather.set(
      daily.time.map((time: Date, i: number): WeeklyWeatherData => {
        const weatherData = this.weatherCodeService.getWeatherCode(daily.weather_code[i], true);
        return {
          day: new Date(time).toLocaleDateString('en-US', {weekday: 'long'}),
          weather: weatherData.weather,
          max_temperature: Math.round(daily.temperature_2m_max[i]),
          min_temperature: Math.round(daily.temperature_2m_min[i]),
          icon: weatherData.icon
        }
      }));  
  }

}
