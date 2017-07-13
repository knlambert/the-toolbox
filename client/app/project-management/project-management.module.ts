import { NgModule }      from '@angular/core';
import { CommonModule }       from '@angular/common';
import { RouterModule }   from '@angular/router';
import MaterialModule from './../material/material.module';
import { PlanningComponent } from './planning/planning.component';
import { DBModule } from './../db/db.module';


@NgModule({
  imports:      [
    MaterialModule,
    CommonModule,
    DBModule,
    RouterModule.forChild(
      [
        {
          path: 'planning',
          component: PlanningComponent
        }
      ]
    )
  ],
  declarations: [ PlanningComponent],
  exports: [ ],
  providers: [ ]
})
export class ProjectManagementModule { }
