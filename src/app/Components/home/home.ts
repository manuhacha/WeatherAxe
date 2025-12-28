import { Component, inject, signal } from '@angular/core';
import { OpenMeteo } from '../../Services/OpenMeteo/open-meteo';
import { CurrentWeather  } from '../../Models/CurrentWeather'
import { Header } from '../Reusable/header/header';
import { Footer } from '../Reusable/footer/footer';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { WeatherCode } from '../../Services/WeatherCode/weather-code';
import { Spinner } from '../Reusable/spinner/spinner';


@Component({
  selector: 'app-home',
  imports: [Header, Footer, FontAwesomeModule, Spinner],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {

  //Inyectamos nuestro servicio
  openMeteoService = inject(OpenMeteo);
  //Inyectamos nuestro servicio para diferenciar los codigos de tiempo
  weatherCodeService = inject(WeatherCode);
  //Creamos una señal para CurrentWeather
  currentWeather = signal<Partial<CurrentWeather>>({}); //Usamos un Partial para crear objeto vacío y posteriormente rellenarlo
  //Creamos variable de error
  error = signal<string | null>(null);
  //Creamos una variable para saber si está cargando
  isLoading = signal<Boolean>(false);
  //Iconos de fontawesome
  faLocationDot = faLocationDot;

  ngOnInit() {
    //Al iniciar cargamos nuestro método
    this.loadCurrent();
  }

  loadCurrent() {
    //Mostramos nuestro spinner mientras se cargan los datos
    this.isLoading.set(true);
    //Ejecutamos nuestro servicio
    this.openMeteoService.getCurrent(37.42163142300899, -5.96830678499587)
    .subscribe({
      next: (res) => {
        console.log(res);
        this.currentWeather.set({
          temperature: Math.round(res.current.temperature_2m),
          time: this.getCurrentTime(res.timezone),
          apparent_temperature: Math.round(res.current.apparent_temperature),
          //Enviamos el codigo de tiempo para que nuestro servicio nos devuelva el icono y el tiempo actual
          icon: this.weatherCodeService.getWeatherCode(res.current.weather_code, res.current.is_day).icon,
          weather: this.weatherCodeService.getWeatherCode(res.current.weather_code, res.current.is_day).weather
        });
        //Estando ya cargados los datos, dejamos de mostrar nuestro spinner
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set('Error loading data');
        //Si hay error también dejamos de mostrar el spinner
        this.isLoading.set(false);
      }
    })
  }

  //Función para rescatar el tiempo actual en base al timezone que devuelve la api
  getCurrentTime(timeZone: string): string {
  //Devolvemos '' si timeZone no existe
  if (!timeZone) {
    return '';
  }
  //Creamos una variable para guardar el tiempo
  const date = new Date();
  //Devolvemos texto formateado
  return new Intl.DateTimeFormat('es-ES', {
    timeZone: timeZone,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).format(date);
  }

}
