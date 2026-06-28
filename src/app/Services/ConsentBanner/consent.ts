import { inject, Injectable, signal } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { ConsentStatus } from '../../Models/ConsentStatus';

@Injectable({
  providedIn: 'root',
})
export class Consent {
  //Usamos el servicio de cookies
  cookieService = inject(CookieService);
  //Creamos un signal con el estado del consentimiento en JSON
  public readonly status = signal<ConsentStatus>({ analytics: false, functional: false });

  //Función para aceptar todo
  acceptAll() {
    this.status.set({ analytics: true, functional: true });
    this.cookieService.set('consent', JSON.stringify(this.status()), 30);
  }

  //Función para rechazar
  declineAll() {
    this.status.set({ analytics: false, functional: true });
    this.cookieService.set('consent', JSON.stringify(this.status()), 30);
  }

  //Función para obtener estado del consentimiento
  getConsent() {
    return this.cookieService.get('consent');
  }

  loadGTM() {
    
    const consent = this.getConsent();

    //Si rechaza no hacemos nada
    if (JSON.parse(consent).analytics === false) return;

    const script = document.createElement('script');
    script.innerHTML = `
        (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','GTM-PSZTT72W');
      `;
    document.head.appendChild(script);
  }
}
