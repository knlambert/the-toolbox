import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

require('./index.css');
/* You can add global styles to this file, and also import other style files */
// import './../node_modules/purecss/build/base.css';
// import './../node_modules/purecss/build/pure.css';
// import './../node_modules/purecss/build/grids-responsive.css';
// import './../node_modules/purecss/build/forms.css';
// import './../node_modules/@angular/material/prebuilt-themes/indigo-pink.css';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));
