import { Injectable } from '@angular/core';
import { DateTime } from 'luxon';

@Injectable({
  providedIn: 'root',
})
export class Time {
  
  //Función para rescatar la fecha actual en base al timezone que devuelve la api de ciudades
  getCurrentTime(timeZone: string): DateTime {
    return DateTime.now().setZone(timeZone);
  }

}
