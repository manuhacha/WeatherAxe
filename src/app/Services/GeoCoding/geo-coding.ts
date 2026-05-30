import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { GeoCodingAPIResponse } from '../../Models/Responses/GeoCodingAPIResponse';

@Injectable({
  providedIn: 'root',
})
export class GeoCoding {
  
  private http = inject(HttpClient);

  protected readonly apiUrl = 'https://geocoding-api.open-meteo.com/v1/search'

  search(name: string) {

    const params = {
      name: name,
      count: 10,
      language: 'en',
      format: 'json'
    }

    return this.http.get<GeoCodingAPIResponse>(this.apiUrl, { params });
  }
}
