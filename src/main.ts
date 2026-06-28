import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { Consent } from './app/Services/ConsentBanner/consent';

bootstrapApplication(App, appConfig)
  .then(app => {
    const consent = app.injector.get(Consent);
    consent.loadGTM();
  })
  .catch((err) => console.error(err));
