import { Component, EventEmitter, Output, signal } from '@angular/core';
import { GpsModal } from '../gps-modal/gps-modal';
import { City } from '../../../Models/City';

@Component({
  selector: 'app-gpssearch',
  imports: [GpsModal],
  templateUrl: './gpssearch.html',
  styleUrl: './gpssearch.css',
})
export class Gpssearch {

  //Creamos signal para mostrar o no el modal
  protected readonly showModal = signal<boolean>(false);
  //Creamos un output para la ciudad que nos pasa el hijo, que nosotros pasaremos al padre
  @Output() city = new EventEmitter();

  //Cambiamos el status
  displayModal() {
    this.showModal.set(true);
  }

  //Recibimos el evento del hijo para dejar de mostrarlo
  receiveModalStatus(status: boolean) {
    this.showModal.set(status);
  }

  //Recibimos la ciudad del hijo y la emitimos al padre
  receiveCity(city: City) {
    this.city.emit(city);
  }
}
