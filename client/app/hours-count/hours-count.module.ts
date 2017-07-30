import { NgModule }      from '@angular/core';
import { CommonModule }       from '@angular/common';
import { CalendarComponent }   from './calendar/calendar.component';
import { CollectionComponent }   from './collection/collection.component';
import { HourEditFormComponent }   from './hour-edit-form/hour-edit-form.component';
import { HoursCountComponent } from './hours-count/hours-count.component';
import { ProjectLoadComponent } from './project-load/project-load.component';
import { ProjectLoadCalendarComponent } from './project-load-calendar/project-load-calendar.component';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule }   from '@angular/router';
import { AppCommonModule } from "./../app-common/app-common.module";
import MaterialModule from './../material/material.module';
import { ProjectAssignementService } from './project-assignement.service';
import { GoogleColorsService } from './../app-common/google-colors.service';
import { DBModule } from './../db/db.module';


@NgModule({
  imports:      [
    MaterialModule,
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    HttpModule,
    AppCommonModule,
    DBModule,
    RouterModule.forChild(
      [
        {
          path: 'mine/:date',
          component: HoursCountComponent
        },
        {
          path: 'project-load',
          component: ProjectLoadComponent
        }
      ]
    )
  ],
  declarations: [ ProjectLoadCalendarComponent, ProjectLoadComponent, CalendarComponent, CollectionComponent, HourEditFormComponent, HoursCountComponent],
  exports: [ ProjectLoadComponent, HoursCountComponent, RouterModule ],
  providers: [ ProjectAssignementService, GoogleColorsService ]
})
export class HoursCountModule { }
