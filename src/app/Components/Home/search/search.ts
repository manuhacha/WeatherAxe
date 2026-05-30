import { Component, EventEmitter, inject, Output, signal } from '@angular/core';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { City } from '../../../Models/City';
import { ToastrService } from 'ngx-toastr';
import { GeoCoding } from '../../../Services/GeoCoding/geo-coding';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { NgClass } from '@angular/common';


@Component({
  selector: 'app-search',
  imports: [ReactiveFormsModule, FontAwesomeModule, NgClass],
  templateUrl: './search.html',
  styleUrl: './search.css',
})
export class Search {

    //Creamos un output para enviarle los datos al componente padre
    @Output() city = new EventEmitter<City>();
    //Creamos nuestro control para el search
    searchControl = new FormControl('');
    //Creamos nuestro array de resultados
    protected readonly results = signal<City[]>([]);
    //Inyectamos nuestro servicio de toasts
    toastr = inject(ToastrService);
    //Inyectamos nuestro servicio de GeoCoding
    searchService = inject(GeoCoding);
    //Icono
    faMagnifyingGlass = faMagnifyingGlass;

    ngOnInit() {
    //Lógica para la búsqueda de ciudades, se ejecuta cuando cambia el valor del input
    this.searchControl.valueChanges
      .pipe(
        debounceTime(500), //espera 500ms sin escribir
        distinctUntilChanged(), //evita ejecuciones repetidas
      )
      //Ejecutamos nuestro metodo de buscar
      .subscribe((value) => {
        if (value) {
          this.search(value);
        }
        //Limpiamos array si no ha escrito nada
        else {
          this.results.set([]);
        }
      });
    }

  search(name: string) {
    //Mostramos nuestro spinner mientras se cargan los datos
    this.searchService.search(name).subscribe({
      next: (res) => {
          //Hacemos un .map para recorrer la respuesta y pasar los datos a nuestro array de ciudades
          this.results.set(res.results);
      },
      error: (err) => {
        this.toastr.error('Error loading data');
      },
    });
  }

  getCityData(city:City) {
    //Enviamos la ciudad al componente padre
    this.city.emit(city);
    //Vaciamos el array de resultados para cuando clicke en alguna ciudad
    this.results.set([]);
    this.searchControl.setValue('');
  }

}
