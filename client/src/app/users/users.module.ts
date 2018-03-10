import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DBModule } from './../db/db.module';
import { UsersService } from './users.service';
import { AuthUsersService } from './../auth/auth-users.service';
import { FlexLayoutModule } from "@angular/flex-layout";
import { AppCommonModule } from './../app-common/app-common.module'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PieChartModule, GaugeModule } from '@swimlane/ngx-charts';
import { MaterialModule } from './../material/material.module';
import { UsersMenuComponent } from './users-menu/users-menu.component';
import { UsersListComponent } from './users-list/users-list.component';
import { GoogleColorsService } from './../app-common/google-colors.service';
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
        }
      ]
    )

  ],
  declarations: [
    UsersMenuComponent,
    UsersListComponent,
    UsersListItemComponent
  ],
  exports: [],
  providers: [
    UsersService,
    AuthUsersService,
    GoogleColorsService
  ],
  entryComponents: [
    UsersListItemComponent
  ]
})
export class UsersModule {
  
}
