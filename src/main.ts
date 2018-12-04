import 'hammerjs';
import {enableProdMode} from '@angular/core';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';

import {AppModule} from './app/app.module';
import {environment} from './environments/environment';


declare var Chart: any;
if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));

Chart.defaults.global.defaultFontColor = 'rgba(0,0,0,.87)';
Chart.defaults.global.defaultFontFamily = 'Roboto Condensed, Helvetica Neue, Helvetica, Arial, sans-serif';
