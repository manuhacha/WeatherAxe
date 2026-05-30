import { CurrentWeatherData } from '../../../Models/CurrentWeatherData';
import { Component, inject, Input, signal } from '@angular/core';
import { WeatherCode } from '../../../Services/WeatherCode/weather-code';
import { OpenMeteoAPIResponse } from '../../../Models/Responses/OpenMeteoAPIResponse';
import { City } from '../../../Models/City';
import { Time } from '../../../Services/Time/time';
import { faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';


@Component({
  selector: 'app-current-weather',
  imports: [FontAwesomeModule],
  templateUrl: './current-weather.html',
  styleUrl: './current-weather.css',
})
export class CurrentWeather {
  //Inyectamos servicio de código de tiempo
  weatherCodeService = inject(WeatherCode);
  //Inyectamos servicio de tiempo
  timeService = inject(Time);
  //Creamos una señal para CurrentWeather
  protected readonly currentWeather = signal<CurrentWeatherData | null>(null);
  //Creamos nuestros inputs para que el componente padre nos pase
  @Input() data:OpenMeteoAPIResponse | null = null;
  @Input() city:City | null = null;
  //Iconos
  faLocationDot = faLocationDot;

  ngOnInit() {
    this.loadCurrent();
  }
  
  //Obtenemos el tiempo actual
  loadCurrent() {
    if (!this.city || !this.data) return;
    
    //Enviamos el codigo de tiempo para que nuestro servicio nos devuelva el icono y el tiempo actual
    const weatherData = this.weatherCodeService.getWeatherCode(
      this.data.current.weather_code,
      this.data.current.is_day,
    );

    this.currentWeather.set({
      temperature: Math.round(this.data.current.temperature_2m),
      time: this.timeService.getCurrentTime(this.city.timezone).toFormat('HH:mm a'),
      apparent_temperature: Math.round(this.data.current.apparent_temperature),
      icon: weatherData.icon,
      weather: weatherData.weather,
      city: this.city.name,
    });
  }
}
