import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from "@angular/flex-layout";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MySettingsComponent } from './my-settings/my-settings.component';
import { AppParametersFormComponent } from './app-parameters-form/app-parameters-form.component';
import { MaterialModule } from './../material/material.module';
import { AuthModule } from './../auth/auth.module';

@NgModule({
  imports: [
    CommonModule,
    AuthModule,
    MaterialModule,
    FormsModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    RouterModule.forChild(
      [
        {
          path: 'my-settings',
          component: MySettingsComponent
        }
      ]
    )
  ],
  declarations: [MySettingsComponent, AppParametersFormComponent],
  exports: [RouterModule],
  providers: []
})
export class ParametersModule { }
