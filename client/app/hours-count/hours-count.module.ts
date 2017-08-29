import { NgModule }      from '@angular/core';
import { CommonModule }       from '@angular/common';
import { CalendarComponent }   from './calendar/calendar.component';
import { HoursCalendarComponent }   from './hours-calendar/hours-calendar.component';
import { HoursCalendarDay }   from './hours-calendar-day/hours-calendar-day.component';
import { CollectionComponent }   from './collection/collection.component';
import { HourEditFormComponent }   from './hour-edit-form/hour-edit-form.component';
import { HoursCountComponent } from './hours-count/hours-count.component';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
import { RouterModule }   from '@angular/router';
import { AppCommonModule } from "./../app-common/app-common.module";
import MaterialModule from './../material/material.module';
import { ProjectAssignementService } from './project-assignement.service';
import { GoogleColorsService } from './../app-common/google-colors.service';
import { DBModule } from './../db/db.module';


@NgModule({
  imports:      [
    MaterialModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AppCommonModule,
    DBModule,
    RouterModule.forChild(
      [
        {
          path: 'mine/:date',
          component: HoursCountComponent
        }
      ]
    )
  ],
  declarations: [ CalendarComponent, CollectionComponent, HourEditFormComponent, HoursCountComponent, HoursCalendarComponent, HoursCalendarDay],
  exports: [ HoursCountComponent, RouterModule ],
  providers: [ ProjectAssignementService, GoogleColorsService ]
})
export class HoursCountModule { }
