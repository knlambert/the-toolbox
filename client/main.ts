import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import {LocationStrategy, HashLocationStrategy} from '@angular/common';
import { AppModule } from './app/app.module';

const platform = platformBrowserDynamic();

require('./index.css');

platform.bootstrapModule(
  AppModule
).then(() => {
  registerServiceWorker('sw')
});
console.log("GO2")

function registerServiceWorker(swName: string) {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
      .register(`/${swName}.js`)
      .then(reg => {
        console.log('[App] Successful service worker registration', reg);
      })
      .catch(err =>
        console.error('[App] Service worker registration failed', err)
      );
  } else {
    console.error('[App] Service Worker API is not supported in current browser');
  }
}