import { Component, EventEmitter, inject, Output, signal } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { GeoCoding } from '../../../Services/GeoCoding/geo-coding';
import { ToastrService } from 'ngx-toastr';
import { City } from '../../../Models/City';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-gps-modal',
  imports: [FontAwesomeModule, MatProgressSpinnerModule],
  templateUrl: './gps-modal.html',
  styleUrl: './gps-modal.css',
})
export class GpsModal {
  //Inyectamos nuestro servicio de GeoCoding
  searchService = inject(GeoCoding);
  toastr = inject(ToastrService);
  //Iconos
  faLocationDot = faLocationDot;
  //Creamos un output para notificar al componente padre de si queremos usar la ubicación por GPS o no
  @Output() showGPSModal = new EventEmitter<boolean>();
  //Creamos un output para devolver la ciudad al componente padre
  @Output() city = new EventEmitter<City>();
  protected readonly isLoading = signal<boolean>(false);

  getGPSLocation(status: boolean) {
    if (status) {
      this.isLoading.set(true);
      //Si el navegador no es compatible con la GeoLocalización, devolvemos error
      if (!navigator.geolocation) {
        this.toastr.error('Geolocation is not supported by this browser.');
        this.showGPSModal.emit(false);
        return;
      }

      //Sacamos los datos del usuario
      navigator.geolocation.getCurrentPosition(
        (position) => {
          //Si position devuelve algo, extraemos la latitud y la longitud
          this.searchService
            .reverseSearch(position.coords.latitude, position.coords.longitude)
            .subscribe({
              next: (res) => {
                const name = res.address.city;
                const country_code = res.address.country_code;

                //Obtenemos la ciudad en base al name y country code que nos devuelve la API de Nominatim
                this.getCity(name, country_code);
              },
              error: (err) => {
                this.toastr.error('Error loading data');
                this.showGPSModal.emit(false);
              },
            });
        },
        (error) => {
          //Si el usuario no ha dado permisos le mostramos el toast con el error
          if (error.code === error.PERMISSION_DENIED) {
            this.toastr.error('You have to grant permission to access your location');
            this.showGPSModal.emit(false);
          }
        }); 
    } else {
      this.showGPSModal.emit(false);
    }
  }

  getCity(name: string, country_code: string) {
    this.searchService.search(name, country_code).subscribe({
      next: (res) => {
        const city: City = {
          name: res.results[0].name,
          latitude: res.results[0].latitude,
          longitude: res.results[0].longitude,
          country_code: res.results[0].country_code,
          timezone: res.results[0].timezone,
        };
        this.city.emit(city);
        this.showGPSModal.emit(false);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.toastr.error('Error loading data');
        this.showGPSModal.emit(false);
      },
    });
  }
}
