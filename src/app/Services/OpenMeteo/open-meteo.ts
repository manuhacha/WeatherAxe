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

  //Función para obtener el clima actual
  getCurrent(lat: number, lon: number) {
    const params = {
      latitude: lat,
      longitude: lon,
      current: 'temperature_2m,apparent_temperature,weather_code,is_day',
      timezone: 'auto'
    };
    return this.http.get<any>(this.apiUrl, { params });
  }

}
