import { NgModule }      from '@angular/core';
import { CommonModule }       from '@angular/common';
import { RouterModule }   from '@angular/router';
import { DBModule } from './../db/db.module';
import { AppCommonModule } from './../app-common/app-common.module'
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
import { FlexLayoutModule } from "@angular/flex-layout";
import { ProjectListMenuComponent } from './project-list-menu/project-list-menu.component';
import { ProjectListItemComponent } from './project-list-item/project-list-item.component';
import { LoaderComponent } from './../app-common/loader/loader.component';
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
        }
      ]
    )
  ],
  declarations: [ 
    ProjectListMenuComponent,
    ProjectListItemComponent
  ],
  exports: [ ],
  providers: [ ],
  entryComponents: [
    LoaderComponent
  ]
})
export class ProjectsModule { }
