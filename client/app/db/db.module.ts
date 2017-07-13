import { NgModule }      from '@angular/core';
import { CommonModule }       from '@angular/common';
import { HttpModule } from '@angular/http';
import { RouterModule }   from '@angular/router';
import { DBService } from './db.service';
import { DBAutocompleteComponent } from './db-autocomplete/db-autocomplete.component';
import MaterialModule from './../material/material.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports:      [
    CommonModule,
    HttpModule,
    MaterialModule,
    FormsModule
  ],
  declarations: [ DBAutocompleteComponent],
  exports: [ DBAutocompleteComponent ]
})
export class DBModule {}
