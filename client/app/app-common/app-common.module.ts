import { NgModule }      from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule }   from '@angular/router';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
import { FlexLayoutModule } from "@angular/flex-layout";
import { LoaderComponent } from './loader/loader.component';
import { ReportComponent } from './report/report.component';
import { FlexibleFormComponent } from './flexible-form/flexible-form.component';
import { MainMenuComponent }   from './main-menu/main-menu.component';
import { FilterComponent }   from './filter/filter.component';
import { CollectionComponent } from './collection/collection.component'
import { CollectionItemDynamicDirective } from './collection-item-dynamic/collection-item-dynamic.directive';
import { SimpleFilterscomponent } from './simple-filters/simple-filters.component';
import { DBModule } from './../db/db.module';
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
    LoaderComponent, 
    ReportComponent, 
    FlexibleFormComponent, 
    FilterComponent,
    CollectionComponent,
    SimpleFilterscomponent,
    CollectionItemDynamicDirective
    ],
  exports: [ 
    MainMenuComponent, 
    LoaderComponent, 
    ReportComponent, 
    FlexibleFormComponent, 
    FilterComponent,
    CollectionComponent,
    SimpleFilterscomponent,
    CollectionItemDynamicDirective
  ],
  providers: [  ]
})
export class AppCommonModule { }
