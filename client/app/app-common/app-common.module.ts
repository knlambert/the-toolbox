import { NgModule }      from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule }   from '@angular/router';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
import { FlexLayoutModule } from "@angular/flex-layout";
import { ReportComponent } from './report/report.component';
import { FlexibleFormComponent } from './flexible-form/flexible-form.component';
import { MainMenuComponent }   from './main-menu/main-menu.component';
import { FilterComponent }   from './filter/filter.component';
import { CollectionComponent } from './collection/collection.component'
import { SimpleFilterscomponent } from './simple-filters/simple-filters.component';
import { DBModule } from './../db/db.module';
import { CollectionButtonsComponent } from './collection-buttons/collection-buttons.component';
import MaterialModule from './../material/material.module';

@NgModule({
  imports:      [ 
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
    CollectionButtonsComponent
    ],
  exports: [ 
    MainMenuComponent, 
    ReportComponent, 
    FilterComponent,
    CollectionComponent,
    FlexibleFormComponent, 
    SimpleFilterscomponent
  ],
  providers: [  ]
})
export class AppCommonModule { }
