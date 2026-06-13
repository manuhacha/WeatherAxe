import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { OpenMeteoAPIResponse } from '../../Models/Responses/OpenMeteoAPIResponse';

@Injectable({
  providedIn: 'root',
})
export class OpenMeteo {
  
  //Insertamos el cliente http
  private http = inject(HttpClient);
  //Creamos nuestra url
  private readonly apiUrl = 'https://api.open-meteo.com/v1/forecast';

  //Función para obtener el clima actual
  getWeather(lat: number, lon: number) {
    const params = {
      latitude: lat,
      longitude: lon,
      current: 'temperature_2m,apparent_temperature,weather_code,is_day',
      daily: 'weather_code,temperature_2m_max,temperature_2m_min',
      hourly: `temperature_2m,weather_code,precipitation_probability,precipitation,is_day`,
      timezone: 'auto',
    };
    return this.http.get<OpenMeteoAPIResponse>(this.apiUrl, { params });
  }

}
