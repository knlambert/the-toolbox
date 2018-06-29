import { NgModule } from '@angular/core';
import { DBModule } from './../db/db.module';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from "@angular/flex-layout";
import { ReportComponent } from './report/report.component';
import { FilterComponent } from './filter/filter.component';
import { MaterialModule } from './../material/material.module';
import { NotificationService } from './notification.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MainMenuComponent } from './main-menu/main-menu.component';
import { CollectionComponent } from './collection/collection.component'
import { FlexibleFormComponent } from './flexible-form/flexible-form.component';
import { SimpleFilterscomponent } from './simple-filters/simple-filters.component';
import { MenuNotificationComponent } from './notification-menu/notification-menu.component';
import { CollectionButtonsComponent } from './collection-buttons/collection-buttons.component';

@NgModule({
  imports: [
    MaterialModule,
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    DBModule,
    FlexLayoutModule
  ],
  declarations: [
    MainMenuComponent,
    ReportComponent,
    FlexibleFormComponent,
    FilterComponent,
    CollectionComponent,
    SimpleFilterscomponent,
    MenuNotificationComponent,
    CollectionButtonsComponent
  ],
  exports: [
    MainMenuComponent,
    ReportComponent,
    FilterComponent,
    CollectionComponent,
    FlexibleFormComponent,
    SimpleFilterscomponent,
    CollectionButtonsComponent
  ],
  entryComponents: [
    MenuNotificationComponent
  ],
  providers: [
  ]
})
export class AppCommonModule { }
