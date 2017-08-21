import { NgModule }      from '@angular/core';
import { CommonModule }       from '@angular/common';
import { RouterModule }   from '@angular/router';
import MaterialModule from './../material/material.module';
import { PlanningComponent } from './planning/planning.component';
import { PlanningMenuComponent } from './planning-menu/planning-menu.component';
import { DBModule } from './../db/db.module';
import { ProjectLoadComponent } from './project-load/project-load.component';
import { ProjectLoadCalendarComponent } from './project-load-calendar/project-load-calendar.component';
import { ProjectSearchComponent } from './project-search/project-search.component';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
import { PlanningTaskRowComponent } from './planning-task-row/planning-task-row.component';

@NgModule({
  imports:      [
    MaterialModule,
    CommonModule,
    DBModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(
      [
        {
          path: 'planning',
          component: PlanningMenuComponent
        },
        {
          path: 'project-load',
          component: ProjectLoadComponent
        }
      ]
    )
  ],
  declarations: [ 
    ProjectLoadCalendarComponent, 
    PlanningComponent, 
    PlanningMenuComponent, 
    ProjectLoadComponent,
    ProjectSearchComponent,
    PlanningTaskRowComponent
  ],
  exports: [ ],
  providers: [ ]
})
export class ProjectManagementModule { }
