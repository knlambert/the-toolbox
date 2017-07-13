import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import {LocationStrategy, HashLocationStrategy} from '@angular/common';
import { AppModule } from './app/app.module';

const platform = platformBrowserDynamic();

require('./index.css');

platform.bootstrapModule(
  AppModule
);
