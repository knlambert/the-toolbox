import {NgModule} from "@angular/core";

import {
  MatChipsModule,
  MatAutocompleteModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule,
  MatCheckboxModule,
  MatDialogModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatRippleModule,
  MatSelectModule,
  MatSidenavModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatPaginatorModule
} from "@angular/material";

let materialModules = [
  MatChipsModule,
  MatButtonModule,
  MatCardModule,
  MatCheckboxModule,
  MatRadioModule,
  MatInputModule,
  MatSidenavModule,
  MatToolbarModule,
  MatListModule,
  MatGridListModule,
  MatIconModule,
  MatProgressSpinnerModule,
  MatProgressBarModule,
  MatTabsModule,
  MatSlideToggleModule,
  MatButtonToggleModule,
  MatSliderModule,
  MatMenuModule,
  MatTooltipModule,
  MatRippleModule,
  MatDialogModule,
  MatSnackBarModule,
  MatSelectModule,
  MatAutocompleteModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatPaginatorModule
];

@NgModule({
  imports: materialModules,
  declarations: [],
  exports: materialModules
})
export default class MaterialModule {
}