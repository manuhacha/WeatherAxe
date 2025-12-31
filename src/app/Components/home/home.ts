import { Component, inject, signal } from '@angular/core';
import { OpenMeteo } from '../../Services/OpenMeteo/open-meteo';
import { CurrentWeather  } from '../../Models/CurrentWeather'
import { Header } from '../Reusable/header/header';
import { Footer } from '../Reusable/footer/footer';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { WeatherCode } from '../../Services/WeatherCode/weather-code';
import { Spinner } from '../Reusable/spinner/spinner';
import { GeoCoding } from '../../Services/GeoCoding/geo-coding';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-home',
  imports: [Header, Footer, FontAwesomeModule, Spinner, ReactiveFormsModule ],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {

  //Inyectamos nuestro servicio
  openMeteoService = inject(OpenMeteo);
  //Inyectamos nuestro servicio para diferenciar los codigos de tiempo
  weatherCodeService = inject(WeatherCode);
  //Inyectamos nuestro servicio de busqueda
  searchService = inject(GeoCoding);
  //Creamos nuestro control para el search
  searchControl = new FormControl('');
  //Creamos nuestro array de resultados
  results = signal<[]>([]);
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
    //Lógica para ls búsqueda de ciudades, se ejecuta cuando cambia el valor del input
    this.searchControl.valueChanges.pipe(
      debounceTime(500), //espera 500ms sin escribir
      distinctUntilChanged() //evita ejecuciones repetidas
    )
    //Ejecutamos nuestro metodo de buscar
    .subscribe(value => {
      if (value) {
        this.search(value);
      }
    })
  }

  loadCurrent() {
    //Mostramos nuestro spinner mientras se cargan los datos
    this.isLoading.set(true);
    //Ejecutamos nuestro servicio
    this.openMeteoService.getCurrent(50.63373, 5.56749)
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

  search(name: string) {

    this.searchService.search(name)
    .subscribe({
      next: (res) => {
        this.results.set(res.results);
        console.log(this.results());
      },
      error: (err) => {
        console.log(err);
      }
    })

  }

}
