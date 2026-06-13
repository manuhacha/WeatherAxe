import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { GeoCodingAPIResponse } from '../../Models/Responses/GeoCodingAPIResponse';
import { NominatimAPIResponse } from '../../Models/Responses/NominatimAPIResponse';

@Injectable({
  providedIn: 'root',
})
export class GeoCoding {
  
  private http = inject(HttpClient);

  protected readonly apiUrl = 'https://geocoding-api.open-meteo.com/v1/search';
  protected readonly nominatimApiUrl = `https://nominatim.openstreetmap.org/reverse`;


  search(name: string, country_code?: string) {

    let params:any = {
      name: name,
      count: 10,
      language: 'en',
      format: 'json'
    }

    //Si incluyen country code lo añadimos a los params
    if (country_code) {
      params.country_code = country_code;
    }

    return this.http.get<GeoCodingAPIResponse>(this.apiUrl, { params });
  }

  reverseSearch(lat: number, lon: number) {

    const params = {
      lat: lat,
      lon: lon,
      format: 'jsonv2'
    }

    return this.http.get<NominatimAPIResponse>(this.nominatimApiUrl, { params });

  }
}
