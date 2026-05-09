import { Component, inject, signal } from '@angular/core';
import { OpenMeteo } from '../../Services/OpenMeteo/open-meteo';
import { CurrentWeather } from '../../Models/CurrentWeather';
import { DailyWeather } from '../../Models/DailyWeather';
import { Header } from '../header/header';
import { Footer } from '../footer/footer';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { WeatherCode } from '../../Services/WeatherCode/weather-code';
import { Spinner } from '../spinner/spinner';
import { GeoCoding } from '../../Services/GeoCoding/geo-coding';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { City } from '../../Models/City';
import { ToastrService } from 'ngx-toastr';
import { HourlyWeather } from '../../Models/HourlyWeather';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [Header, Footer, FontAwesomeModule, Spinner, ReactiveFormsModule, DatePipe],
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
  currentWeather = signal<CurrentWeather | null>(null); //Usamos un Partial para crear objeto vacío y posteriormente rellenarlo
  //Creamos una señal para DailyWeather
  dailyWeather = signal<DailyWeather[]>([]);
  //Creamos una señal para HourlyWeather
  hourlyWeather = signal<HourlyWeather[]>([]);
  //Creamos variable de error
  error = signal<string | null>(null);
  //Creamos una variable para saber si está cargando
  isCurrentLoading = signal<Boolean>(false);
  isSeachLoading = signal<Boolean>(false);
  //Iconos de fontawesome
  faLocationDot = faLocationDot;
  //Inyectamos nuestro servicio de toasts
  toastr = inject(ToastrService);

  ngOnInit() {
    //Cargamos la ciudad guardada en localstorage, si la hay
    const savedCity = localStorage.getItem('saved_city');
    if (savedCity) {
      this.loadCurrent(JSON.parse(savedCity));
    }

    //Lógica para la búsqueda de ciudades, se ejecuta cuando cambia el valor del input
    this.searchControl.valueChanges
      .pipe(
        debounceTime(500), //espera 500ms sin escribir
        distinctUntilChanged(), //evita ejecuciones repetidas
      )
      //Ejecutamos nuestro metodo de buscar
      .subscribe((value) => {
        if (value) {
          this.currentWeather.set(null);
          this.search(value);
        }
        //Limpiamos array si no ha escrito nada
        else {
          this.results.set([]);
        }
      });
  }

  loadCurrent(city: City) {
    //Vaciamos el array de resultados para cuando clicke en alguna ciudad
    this.results.set([]);
    this.searchControl.setValue('');
    //Mostramos nuestro spinner mientras se cargan los datos
    this.isCurrentLoading.set(true);
    //Ejecutamos nuestro servicio
    this.openMeteoService.getCurrent(city.latitude, city.longitude, this.getCurrentTime(city.timezone)).subscribe({
      next: (res) => {
        console.log(res);
        //Enviamos el codigo de tiempo para que nuestro servicio nos devuelva el icono y el tiempo actual
        const weatherData = this.weatherCodeService.getWeatherCode(res.current.weather_code, res.current.is_day);
        this.currentWeather.set({
          temperature: Math.round(res.current.temperature_2m),
          time: this.getCurrentTime(city.timezone),
          apparent_temperature: Math.round(res.current.apparent_temperature),
          icon: weatherData.icon,
          weather: weatherData.weather,
          city: city.name,
        });
        this.hourlyWeather.set(
          res.hourly.time.map((time: Date, i: number): HourlyWeather => {
          const weatherData = this.weatherCodeService.getWeatherCode(res.hourly.weather_code[i], true);
            return {
              time: res.hourly.time[i],
              temperature: res.hourly.temperature_2m[i],
              weather: weatherData.weather,
              icon: weatherData.icon
            }
          })
        )

        console.log(this.hourlyWeather())

        //Obtenemos el tiempo de los días de la semana
        this.dailyWeather.set(
          res.daily.time.map((time: Date, i: number): DailyWeather => {
            const weatherData = this.weatherCodeService.getWeatherCode(res.daily.weather_code[i], true);
            return {
              day: new Date(time).toLocaleDateString('en-US', {weekday: 'long'}),
              weather: weatherData.weather,
              max_temperature: Math.round(res.daily.temperature_2m_max[i]),
              min_temperature: Math.round(res.daily.temperature_2m_min[i]),
              icon: weatherData.icon
            }
          }));  

        //Guardamos nuestras coordenadas en localstorage, para que la próxima vez que entre tenga su última búsqueda
        localStorage.setItem('saved_city', JSON.stringify(city));
        //Estando ya cargados los datos, dejamos de mostrar nuestro spinner
        this.isCurrentLoading.set(false);
      },
      error: (err) => {
        this.toastr.error('Error loading data');
        //Si hay error también dejamos de mostrar el spinner
        this.isCurrentLoading.set(false);
        console.log(err)
      },
    });
  }

  //Función para rescatar la fecha actual en base al timezone que devuelve la api de ciudades
  getCurrentTime(timeZone: string): Date {
    const date = new Date(
      new Date().toLocaleDateString('en-US', {timeZone})
    )
    return date;
  }

  search(name: string) {
    //Mostramos nuestro spinner mientras se cargan los datos
    this.isSeachLoading.set(true);
    this.searchService.search(name).subscribe({
      next: (res) => {
        console.log(res.results);
        if (res.results) {
          //Hacemos un .map para recorrer la respuesta y pasar los datos a nuestro array de ciudades
          this.results.set(
            res.results.map((result: any) => ({
              name: result.name,
              latitude: result.latitude,
              longitude: result.longitude,
              elevation: result.elevation,
              countrycode: result.country_code,
              timezone: result.timezone
            })),
          );
        }
        this.isSeachLoading.set(false);
      },
      error: (err) => {
        this.toastr.error('Error loading data');
        //Si hay error también dejamos de mostrar el spinner
        this.isSeachLoading.set(false);
      },
    });
  }
}
