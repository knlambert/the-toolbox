import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { DBModule } from './db/db.module';
import { DBService } from './db/db.service';
import { AuthModule } from './auth/auth.module';
import { ConnectionService } from './auth/connection.service';
import { AppComponent } from './app.component';
import { AppCommonModule } from './app-common/app-common.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UserInformationsService } from './auth/user-informations.service';
import { MaterialModule } from './material/material.module';
import { environment } from '../environments/environment';
import { ServiceWorkerModule } from '@angular/service-worker';


@NgModule({
  imports: [
    MaterialModule,
    DBModule,
    BrowserModule,
    AppCommonModule,
    AuthModule,
    BrowserAnimationsModule,
    BrowserModule,
    ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production }),
    RouterModule.forRoot(
      [
        {
          path: 'login',
          loadChildren: "./auth/auth.module#AuthModule"
        }, {
          path: 'hours',
          loadChildren: "./hours-count/hours-count.module#HoursCountModule"
        }, {
          path: 'backoffice',
          loadChildren: "./backoffice/backoffice.module#BackofficeModule"
        }, {
          path: 'parameters',
          loadChildren: "./parameters/parameters.module#ParametersModule"
        }, {
          path: 'projects',
          loadChildren: "./projects/projects.module#ProjectsModule"
        }, {
          path: 'users',
          loadChildren: "./users/users.module#UsersModule"
        }, {
          path: '',
          redirectTo: '/hours/mine/now',
          pathMatch: 'full'
        }
      ]
    )
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
  providers: [DBService, ConnectionService, UserInformationsService]
})
export class AppModule { }

