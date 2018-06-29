import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { MaterialModule } from './../material/material.module';
import { AppCommonModule } from './../app-common/app-common.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginFormComponent } from './login-form/login-form.component';
import { NotificationService } from '../app-common/notification.service';
import { ResetPasswordFormComponent } from './reset-password-form/reset-password-form.component';

@NgModule({
  imports: [
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
  declarations: [LoginComponent, LoginFormComponent, ResetPasswordFormComponent],
  exports: [LoginComponent, RouterModule, ResetPasswordFormComponent],
  providers: [
    NotificationService
  ]
})
export class AuthModule { }
