import { Component, inject, signal } from '@angular/core';
import { OpenMeteo } from '../../Services/open-meteo';
import { HourlyForecast } from '../../Models/HourlyForecast' ;
import { Header } from '../header/header';
import { Footer } from '../footer/footer';

@Component({
  selector: 'app-home',
  imports: [Header, Footer],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {

  //Inyectamos nuestro servicio
  openMeteoService = inject(OpenMeteo);
  //Creamos una señal para que detecte los futuros cambios, en este caso para un array de Hourly Forecasts, cuya interfaz hemos creado
  hourlyForecast = signal<HourlyForecast[]>([]);
  //Creamos una variable que guarde la hora actual
  currentHour: number = new Date().getHours();

  ngOnInit() {

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
    })
  }

}
