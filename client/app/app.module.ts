import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule }   from '@angular/router';
import { DBModule } from './db/db.module';
import { DBService } from './db/db.service';
import { AuthModule } from './auth/auth.module';
import { TokenService } from './auth/token.service';
import { ConnectionService } from './auth/connection.service';
import { AppComponent }   from './app.component';
import { AppCommonModule } from './app-common/app-common.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import MaterialModule from './material/material.module';

@NgModule({
  imports:      [
    MaterialModule,
    DBModule,
    BrowserModule,
    AppCommonModule,
    AuthModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(
      [
        {
          path: 'login',
          loadChildren: "./auth/auth.module#AuthModule"
        },{
          path: 'hours',
          loadChildren: "./hours-count/hours-count.module#HoursCountModule"
        },{
          path: 'backoffice',
          loadChildren: "./backoffice/backoffice.module#BackofficeModule"
        },{
          path: 'parameters',
          loadChildren: "./parameters/parameters.module#ParametersModule"
        },{
          path: 'project-management',
          loadChildren: "./project-management/project-management.module#ProjectManagementModule"
        },{
           path: '',
           redirectTo: 'hours',
           pathMatch: 'full'
         }
      ]
    )
  ],
  declarations: [ AppComponent ],
  bootstrap:    [ AppComponent ],
  providers: [  DBService , TokenService, ConnectionService]
})
export class AppModule { }
