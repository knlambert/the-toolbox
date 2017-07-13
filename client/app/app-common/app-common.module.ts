import { NgModule }      from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule }   from '@angular/router';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
import { LoaderComponent } from './loader/loader.component';
import { ReportComponent } from './report/report.component';
import { FlexibleFormComponent } from './flexible-form/flexible-form.component';
import { MainMenuComponent }   from './main-menu/main-menu.component';
import { FilterComponent }   from './filter/filter.component';
import { DBModule } from './../db/db.module';
import MaterialModule from './../material/material.module';

@NgModule({
  imports:      [ 
    MaterialModule, 
    CommonModule, 
    RouterModule, 
    FormsModule, 
    ReactiveFormsModule,
    DBModule
    ],
  declarations: [ 
    MainMenuComponent, 
    LoaderComponent, 
    ReportComponent, 
    FlexibleFormComponent, 
    FilterComponent
    ],
  exports: [ 
    MainMenuComponent, 
    LoaderComponent, 
    ReportComponent, 
    FlexibleFormComponent, 
    FilterComponent
  ],
  providers: [  ]
})
export class AppCommonModule { }
