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
import { City } from '../../Models/City';

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
  results = signal<City[]>([]);
  //Creamos una señal para CurrentWeather
  currentWeather = signal<Partial<CurrentWeather>>({}); //Usamos un Partial para crear objeto vacío y posteriormente rellenarlo
  //Creamos variable de error
  error = signal<string | null>(null);
  //Creamos una variable para saber si está cargando
  isCurrentLoading = signal<Boolean>(false);
  isSeachLoading = signal<Boolean>(false);
  //Iconos de fontawesome
  faLocationDot = faLocationDot;

  ngOnInit() {

    //Cargamos la ciudad guardada en localstorage, si la hay
    const savedCity = localStorage.getItem('saved_city');
    if (savedCity) {
      this.loadCurrent(JSON.parse(savedCity));
    }

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
      //Limpiamos array si no ha escrito nada
      else {
        this.results.set([]);
      }
    })
  }

  loadCurrent(city: City) {
    //Vaciamos el array de resultados para cuando clicke en alguna ciudad
    this.results.set([]);
    this.searchControl.setValue('');
    //Mostramos nuestro spinner mientras se cargan los datos
    this.isCurrentLoading.set(true);
    //Ejecutamos nuestro servicio
    this.openMeteoService.getCurrent(city.latitude,city.longitude)
    .subscribe({
      next: (res) => {
        this.currentWeather.set({
          temperature: Math.round(res.current.temperature_2m),
          time: this.getCurrentTime(res.timezone),
          apparent_temperature: Math.round(res.current.apparent_temperature),
          //Enviamos el codigo de tiempo para que nuestro servicio nos devuelva el icono y el tiempo actual
          icon: this.weatherCodeService.getWeatherCode(res.current.weather_code, res.current.is_day).icon,
          weather: this.weatherCodeService.getWeatherCode(res.current.weather_code, res.current.is_day).weather,
          city: city.name
        });
        //Guardamos nuestras coordenadas en localstorage, para que la próxima vez que entre tenga su última búsqueda
        localStorage.setItem('saved_city', JSON.stringify(city));
        //Estando ya cargados los datos, dejamos de mostrar nuestro spinner
        this.isCurrentLoading.set(false);
      },
      error: (err) => {
        this.error.set('Error loading data');
        //Si hay error también dejamos de mostrar el spinner
        this.isCurrentLoading.set(false);
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
    //Mostramos nuestro spinner mientras se cargan los datos
    this.isSeachLoading.set(true);
    this.searchService.search(name)
    .subscribe({
      next: (res) => {
        if (res.results) {
        //Hacemos un .map para recorrer la respuesta y pasar los datos a nuestro array de ciudades
        this.results.set(
          res.results.map((result:any) => ({
            name: result.name,
            latitude: result.latitude,
            longitude: result.longitude,
            elevation: result.elevation,
            countrycode: result.country_code,
          }))
        );
        }
        this.isSeachLoading.set(false);
      },
      error: (err) => {
        this.error.set('Error loading data');
        //Si hay error también dejamos de mostrar el spinner
        this.isSeachLoading.set(false);      
      }
    })

  }

}
