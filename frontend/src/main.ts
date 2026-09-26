import { provideZoneChangeDetection } from "@angular/core";
import { provideHttpClient, withXhr } from '@angular/common/http';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, {
  providers: [provideZoneChangeDetection(),provideHttpClient(withXhr())]
}).catch(err => console.error(err));
