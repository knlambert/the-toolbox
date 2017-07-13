import { NgModule }      from '@angular/core';
import { CommonModule }       from '@angular/common';
import { RouterModule }   from '@angular/router';
import { MySettingsComponent } from './my-settings/my-settings.component';
import MaterialModule from './../material/material.module';
import { AuthModule } from './../auth/auth.module';

@NgModule({
  imports:      [
    CommonModule,
    AuthModule,
    MaterialModule,
    RouterModule.forChild(
      [
        {
          path: 'my-settings',
          component: MySettingsComponent
        }
      ]
    )
  ],
  declarations: [ MySettingsComponent ],
  exports: [ RouterModule ],
  providers: [ ]
})
export class ParametersModule { }
