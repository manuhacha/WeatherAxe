import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GeoCoding {
  
  constructor(private http: HttpClient) {  }

  protected readonly apiUrl = 'https://geocoding-api.open-meteo.com/v1/search?name=Berlin&count=10&language=en&format=json'

  search(name: string) {

    const params = {
      count: 10,
      language: 'en',
      format: 'json'
    }

    return this.http.get<any>(this.apiUrl, { params })
  }
}
