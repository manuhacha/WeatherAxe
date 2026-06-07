import { Component, inject, Input, signal } from '@angular/core';
import { OpenMeteoAPIResponse } from '../../../Models/Responses/OpenMeteoAPIResponse';
import { City } from '../../../Models/City';
import { HourlyWeather } from '../../../Models/HourlyWeather';
import { Time } from '../../../Services/Time/time';
import { DateTime } from 'luxon';
import { WeatherCode } from '../../../Services/WeatherCode/weather-code';
import { Chart } from "../chart/chart";
import { DatePipe, NgClass } from '@angular/common';

@Component({
  selector: 'app-weekly-weather',
  imports: [Chart, NgClass, DatePipe],
  templateUrl: './weekly-weather.html',
  styleUrl: './weekly-weather.css',
})
export class WeeklyWeather {
  //Creamos una señal para HourlyWeather
  protected readonly hourlyWeather = signal<HourlyWeather[]>([]);
  //Creamos nuestros inputs para que el componente padre nos pase
  @Input() data:OpenMeteoAPIResponse | null = null;
  @Input() city:City | null = null;
  //Inyectamos servicio de tiempo
  timeService = inject(Time);
  //Inyectamos servicio de código de tiempo
  weatherCodeService = inject(WeatherCode);
  //Signal para el estado del toggle de charts
  protected readonly toggleValue = signal<'basic' | 'chart'>('basic');

  ngOnInit() {
    this.loadWeekly();
  }

  loadWeekly() {
    if (!this.data || !this.city) return;

    //Rescatamos el tiempo actual en base al timezone de la ciudad
    const now = this.timeService.getCurrentTime(this.city.timezone);
    //Le sumamos 1 día y ponemos la hora a las 23:00
    const endOfTomorrow = now
      .plus({ days: 1 })
      .set({ hour: 23, minute: 0, second: 0, millisecond: 0 });

    //Guardamos los datos y la ciudad que nos envía el componente padre
    const data = this.data;
    const city = this.city;

    //Metemos los pronósticos en un array para poder filtrar después
    const hourlyForecast: HourlyWeather[] = data.hourly.time.map((time, i) => {
      const weather = this.weatherCodeService.getWeatherCode(data.hourly.weather_code[i], true);

      return {
      time,
      temperature: Math.round(data.hourly.temperature_2m[i]),
      icon: weather.icon,
      weather: weather.weather,
      precipitation_probability: data.hourly.precipitation_probability[i],
      precipitation: data.hourly.precipitation[i]
    };
    });

    //Filtramos para devolver sólo el día actual y el siguiente
    const filteredForecast = hourlyForecast.filter(forecast => {

      //Conseguimos el tiempo del forecast
      const forecastTime = DateTime.fromISO(forecast.time as any, { zone: city.timezone }).toMillis();

      return forecastTime > now.toMillis() && forecastTime <= endOfTomorrow.toMillis(); //Devolvemos si el tiempo de ese 
                                                                                        //forecast es mayor a ahora y si 
                                                                                        // es menor o igual a mañana a las 11
    });

    this.hourlyWeather.set(filteredForecast);
  }

  //Funcion para cambiar el estado del toggle
  selectOption(option: 'basic' | 'chart') {
    this.toggleValue.set(option);
  }
}
