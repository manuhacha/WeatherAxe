import { Component, inject, signal } from '@angular/core';
import { OpenMeteo } from '../../Services/OpenMeteo/open-meteo';
import { HourlyForecast } from '../../Models/HourlyForecast' ;
import { CurrentWeather  } from '../../Models/CurrentWeather'
import { Header } from '../Reusable/header/header';
import { Footer } from '../Reusable/footer/footer';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { ErrorBanner } from '../Reusable/error-banner/error-banner';
import { WeatherCode } from '../../Services/WeatherCode/weather-code';

@Component({
  selector: 'app-home',
  imports: [Header, Footer, FontAwesomeModule, ErrorBanner],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {

  //Inyectamos nuestro servicio
  openMeteoService = inject(OpenMeteo);
  //Inyectamos nuestro servicio para diferenciar los codigos de tiempo
  weatherCodeService = inject(WeatherCode);
  //Creamos una señal para que detecte los futuros cambios, en este caso para un array de Hourly Forecasts, cuya interfaz hemos creado
  hourlyForecast = signal<HourlyForecast[]>([]);
  //Creamos una señal para CurrentWeather
  currentWeather = signal<Partial<CurrentWeather>>({}); //Usamos un Partial para crear objeto vacío y posteriormente rellenarlo
  //Creamos formateador de texto
  formatter = new Intl.DateTimeFormat('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
  error = signal<string | null>(null);
  //Iconos de fontawesome
  faLocationDot = faLocationDot;

  ngOnInit() {
    //Al iniciar cargamos nuestro método
    this.loadCurrent();

  }

  loadCurrent() {
    //Ejecutamos nuestro servicio
    this.openMeteoService.getCurrent(37.42163142300899, -5.96830678499587)
    .subscribe({
      next: (res) => {
        console.log(res);
        this.currentWeather.set({
          temperature: Math.round(res.current.temperature_2m),
          time: new Date(res.current.time),
          apparent_temperature: Math.round(res.current.apparent_temperature),
          icon: this.weatherCodeService.getWeatherCode(res.current.weather_code).icon,
          weather: this.weatherCodeService.getWeatherCode(res.current.weather_code).weather
        });
      },
      error: (err) => {
        this.error.set('Error loading data');
      }
    })
  }

  loadHourly() {
    //Ejecutamos nuestro servicio
    this.openMeteoService.getForecast(37.42163142300899, -5.96830678499587)
    .subscribe({
      next: (res) => {
        //Cambiamos la señal para que detecte el cambio y mapeamos la respuesta a nuestro array de previsiones
        this.hourlyForecast.set(
          res.hourly.time.map((time: string, i: number) => ({
            //Convertimos la fecha de la respuesta a Date
            time: new Date(time),
            //Redondeamos para no mostrar decimales en la temperatura
            temperature: Math.round(res.hourly.temperature_2m[i])
          })));
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

}
