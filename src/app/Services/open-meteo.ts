import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class OpenMeteo {
  
  //Insertamos el cliente http
  constructor(private http: HttpClient) {  }
  //Creamos nuestra url
  private readonly apiUrl = 'https://api.open-meteo.com/v1/forecast';
  
  //Función para obtener la previsión del tiempo
  getForecast(lat: number, lon: number) {
    const params = {
      latitude: lat,
      longitude: lon,
      //Hourly para recibir la previsión para cada hora
      hourly: 'temperature_2m'
    };
    return this.http.get<any>(this.apiUrl, { params });
  }

  //Función para obtener el clima actual
  getCurrent(lat: number, lon: number) {
    const params = {
      latitude: lat,
      longitude: lon,
      current: 'temperature_2m',
      timezone: 'auto'
    };
    return this.http.get<any>(this.apiUrl, { params });
  }

}
