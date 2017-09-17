import { NgModule }      from '@angular/core';
import { CommonModule }       from '@angular/common';
import { RouterModule }   from '@angular/router';
import { DBModule } from './../db/db.module';
import { AppCommonModule } from './../app-common/app-common.module'
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
import { FlexLayoutModule } from "@angular/flex-layout";
import { ProjectListMenuComponent } from './project-list-menu/project-list-menu.component';
import { ProjectListItemComponent } from './project-list-item/project-list-item.component';
import { ProjectDashboardComponent } from './project-dashboard/project-dashboard.component';
import { ProjectFormComponent } from './project-form/project-form.component';
import { ProjectMembersComponent } from './project-members/project-members.component';
import { ProjectMemberForm } from './project-member-form/project-member-form.component';
import MaterialModule from './../material/material.module';

@NgModule({
  imports:      [
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
          component: ProjectListMenuComponent
        },
        {
          path: ':id',
          component: ProjectDashboardComponent
        },
        {
          path: 'new',
          component: ProjectDashboardComponent
        }
      ]
    )
    
  ],
  declarations: [ 
    ProjectDashboardComponent,
    ProjectListMenuComponent,
    ProjectListItemComponent,
    ProjectMembersComponent,
    ProjectMemberForm,
    ProjectFormComponent
  ],
  exports: [ ],
  providers: [ ],
  entryComponents: [
    ProjectListItemComponent
  ]
})
export class ProjectsModule { }
