import { NgModule }      from '@angular/core';
import { CommonModule }       from '@angular/common';
import { AppCommonModule } from './../app-common/app-common.module';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
import { LoginComponent } from './login/login.component'
import { RouterModule }   from '@angular/router';
import { LoginFormComponent } from './login-form/login-form.component';
import { MaterialModule } from './../material/material.module';
import { ResetPasswordForm } from './reset-password-form/reset-password-form.component';

@NgModule({
  imports:      [
    AppCommonModule,
    MaterialModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(
      [
        {
          path: '',
          component: LoginComponent
        }
      ]
    )
  ],
  declarations: [ LoginComponent, LoginFormComponent, ResetPasswordForm ],
  exports: [ LoginComponent, RouterModule, ResetPasswordForm ],
  providers: [  ]
})
export class AuthModule { }
