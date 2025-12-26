import { Component, input } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'ErrorBanner',
  imports: [FontAwesomeModule],
  templateUrl: './error-banner.html',
  styleUrl: './error-banner.css',
})
export class ErrorBanner {

  faXmark = faXmark;
  //Declaramos el input para añadirle el textp real desde otro componente
  error = input<string | null>(null);
}
