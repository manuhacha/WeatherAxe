import { Component, EventEmitter, inject, Output, signal } from '@angular/core';
import { Consent } from '../../Services/ConsentBanner/consent';

@Component({
  selector: 'app-consent-banner',
  imports: [],
  templateUrl: './consent-banner.html',
  styleUrl: './consent-banner.css',
})
export class ConsentBanner {

  //Inyectamos nuestro servicio de consentimiento
  consentService = inject(Consent);
  @Output() showConsent = new EventEmitter<boolean>();


  acceptAll() {
    this.consentService.acceptAll();
    this.showConsent.emit(false);
  }

  declineAll() {
    this.consentService.declineAll();
    this.showConsent.emit(false);
  }

}
