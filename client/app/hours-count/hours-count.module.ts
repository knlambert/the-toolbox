import { NgModule }      from '@angular/core';
import { CommonModule }       from '@angular/common';
import { HoursCalendarComponent }   from './hours-calendar/hours-calendar.component';
import { HoursCalendarDay }   from './hours-calendar-day/hours-calendar-day.component';
import { HourEditFormComponent }   from './hour-edit-form/hour-edit-form.component';
import { HoursCountComponent } from './hours-count/hours-count.component';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
import { RouterModule }   from '@angular/router';
import { AppCommonModule } from "./../app-common/app-common.module";
import MaterialModule from './../material/material.module';
import { ProjectAssignementService } from './project-assignement.service';
import { GoogleColorsService } from './../app-common/google-colors.service';
import { UUIDService } from './uuid.service';
import { FlexLayoutModule } from "@angular/flex-layout";
import { DBModule } from './../db/db.module';


@NgModule({
  imports:      [
    MaterialModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AppCommonModule,
    DBModule,
    FlexLayoutModule,
    RouterModule.forChild(
      [
        {
          path: 'mine/:date',
          component: HoursCountComponent
        }
      ]
    )
  ],
  declarations: [ HourEditFormComponent, HoursCountComponent, HoursCalendarComponent, HoursCalendarDay],
  exports: [ HoursCountComponent, RouterModule ],
  providers: [ ProjectAssignementService, GoogleColorsService, UUIDService ]
})
export class HoursCountModule { }
