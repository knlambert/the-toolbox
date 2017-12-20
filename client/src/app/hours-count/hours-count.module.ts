import { NgModule } from '@angular/core';
import { UUIDService } from './uuid.service';
import { DBModule } from './../db/db.module';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MaterialModule } from './../material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppCommonModule } from './../app-common/app-common.module';
import { HoursCountComponent } from './hours-count/hours-count.component';
import { ProjectAssignementService } from './project-assignement.service';
import { GoogleColorsService } from './../app-common/google-colors.service';
import { HoursCalendarComponent } from './hours-calendar/hours-calendar.component';
import { HourEditFormComponent } from './hour-edit-form/hour-edit-form.component';
import { HoursCalendarDayComponent } from './hours-calendar-day/hours-calendar-day.component';


@NgModule({
  imports: [
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
        }, {
          path: '',
          redirectTo: 'mine/now'
        }
      ]
    )
  ],
  declarations: [HourEditFormComponent, HoursCountComponent, HoursCalendarComponent, HoursCalendarDayComponent],
  exports: [HoursCountComponent, RouterModule],
  providers: [ProjectAssignementService, GoogleColorsService, UUIDService]
})
export class HoursCountModule { }
