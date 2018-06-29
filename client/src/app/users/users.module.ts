import { NgModule } from '@angular/core';
import { DBModule } from './../db/db.module';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from "@angular/flex-layout";
import { MaterialModule } from './../material/material.module';
import { AuthUsersService } from './../auth/auth-users.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PieChartModule, GaugeModule } from '@swimlane/ngx-charts';
import { UserFormComponent } from './user-form/user-form.component';
import { AppCommonModule } from './../app-common/app-common.module';
import { UsersMenuComponent } from './users-menu/users-menu.component';
import { UsersListComponent } from './users-list/users-list.component';
import { NotificationService } from './../app-common/notification.service';
import { GoogleColorsService } from './../app-common/google-colors.service';
import { UserDetailsComponent } from './user-details/user-details.component';
import { UsersListItemComponent } from './users-list-item/users-list-item.component';

@NgModule({
  imports: [
    MaterialModule,
    CommonModule,
    DBModule,
    FormsModule,
    ReactiveFormsModule,
    AppCommonModule,
    FlexLayoutModule,
    RouterModule.forChild(
      [
        {
          path: '',
          component: UsersMenuComponent
        },{
          path: ':id',
          component: UserDetailsComponent
        },{
          path: 'new',
          component: UserDetailsComponent
        }
      ]
    )

  ],
  declarations: [
    UsersMenuComponent,
    UsersListComponent,
    UsersListItemComponent,
    UserFormComponent,
    UserDetailsComponent
  ],
  exports: [],
  providers: [
    AuthUsersService,
    GoogleColorsService,
    NotificationService
  ],
  entryComponents: [
    UsersListItemComponent
  ]
})
export class UsersModule {
  
}
