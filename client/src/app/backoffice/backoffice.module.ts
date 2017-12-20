import { CommonModule } from '@angular/common';
import { BackofficeComponent} from "./backoffice/backoffice.component";
import { NgModule }      from '@angular/core';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
import { RouterModule }   from '@angular/router';
import { AppCommonModule } from './../app-common/app-common.module';
import { MaterialModule } from './../material/material.module';
import { DBModule } from './../db/db.module';

@NgModule({
  imports: [
    MaterialModule,
    AppCommonModule,
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    DBModule,
    RouterModule.forChild(
      [
        {
          path: '',
          component: BackofficeComponent
        }
      ]
    )
  ],
  declarations: [ BackofficeComponent ],
  exports: [ BackofficeComponent  ],
  providers: [  ]
})
export class BackofficeModule { }
