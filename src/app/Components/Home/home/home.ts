import { OpenMeteoAPIResponse } from '../../../Models/Responses/OpenMeteoAPIResponse';
import { Component, inject, signal } from '@angular/core';
import { OpenMeteo } from '../../../Services/OpenMeteo/open-meteo';
import { Header } from '../../Header/header';
import { Footer } from '../../Footer/footer';
import { City } from '../../../Models/City';
import { ToastrService } from 'ngx-toastr';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Search } from '../search/search';
import { CurrentWeather } from "../current-weather/current-weather";
import { WeeklyWeather } from '../weekly-weather/weekly-weather';
import { HourlyWeather } from '../hourly-weather/hourly-weather';
import { GpsModal } from '../gps-modal/gps-modal';

@Component({
  selector: 'app-home',
  imports: [Header, Footer, MatProgressSpinnerModule, Search, CurrentWeather, WeeklyWeather, HourlyWeather, GpsModal],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home { 
  //Inyectamos nuestro servicio
  private openMeteoService = inject(OpenMeteo);
  //Creamos una variable para saber si está cargando
  protected readonly isCurrentLoading = signal<Boolean>(false);
  //Inyectamos nuestro servicio de toasts
  toastr = inject(ToastrService);
  //Creamos la respuesta de la API para enviarla a nuestros componentes
  protected readonly openMeteoApiResponse = signal<OpenMeteoAPIResponse | null>(null);
  //Creamos una ciudad para enviar a nuestros componentes
  protected readonly city = signal<City | null>(null); 
  protected readonly showGPSModal = signal<boolean>(false);

  ngOnInit() {
    //Cargamos la ciudad guardada en localstorage, si la hay
    const savedCity = localStorage.getItem('saved_city');
    if (savedCity) {
      const city = JSON.parse(savedCity);
      this.city.set(city);
      this.showGPSModal.set(false);
      this.getWeather(city);
    }
    else {
      this.showGPSModal.set(true);
    }
  }

  getWeather(city: City) {
    //Mostramos nuestro spinner mientras se cargan los datos
    this.isCurrentLoading.set(true);
    //Ejecutamos nuestro servicio
    this.openMeteoService.getWeather(city.latitude, city.longitude).subscribe({
      next: (res) => {
        this.openMeteoApiResponse.set(res);
        //Guardamos nuestras coordenadas en localstorage, para que la próxima vez que entre tenga su última búsqueda
        localStorage.setItem('saved_city', JSON.stringify(city));
        //Estando ya cargados los datos, dejamos de mostrar nuestro spinner
        this.isCurrentLoading.set(false);
      },
      error: (err) => {
        this.toastr.error('Error loading data');
        //Si hay error también dejamos de mostrar el spinner
        this.isCurrentLoading.set(false);
      },
    });
  }

  //Recibimos la ciudad del componente hijo
  receiveCityData(city:City) {
    this.showGPSModal.set(false);
    this.city.set(city);
    this.getWeather(city);
  }

  //Recibimos el status del modal del componente hijo
  receiveModalStatus(status: boolean) {
    this.showGPSModal.set(status);
  }
}
