import {NgModule} from "@angular/core";

import {
  MdChipsModule,
  MdAutocompleteModule,
  MdButtonModule,
  MdButtonToggleModule,
  MdCardModule,
  MdCheckboxModule,
  MdDialogModule,
  MdGridListModule,
  MdIconModule,
  MdInputModule,
  MdListModule,
  MdMenuModule,
  MdProgressBarModule,
  MdProgressSpinnerModule,
  MdRadioModule,
  MdRippleModule,
  MdSelectModule,
  MdSidenavModule,
  MdSliderModule,
  MdSlideToggleModule,
  MdSnackBarModule,
  MdTabsModule,
  MdToolbarModule,
  MdTooltipModule,
  MdDatepickerModule,
  MdNativeDateModule,
  MdPaginatorModule
} from "@angular/material";

let materialModules = [
  MdChipsModule,
  MdButtonModule,
  MdCardModule,
  MdCheckboxModule,
  MdRadioModule,
  MdInputModule,
  MdSidenavModule,
  MdToolbarModule,
  MdListModule,
  MdGridListModule,
  MdIconModule,
  MdProgressSpinnerModule,
  MdProgressBarModule,
  MdTabsModule,
  MdSlideToggleModule,
  MdButtonToggleModule,
  MdSliderModule,
  MdMenuModule,
  MdTooltipModule,
  MdRippleModule,
  MdDialogModule,
  MdSnackBarModule,
  MdSelectModule,
  MdAutocompleteModule,
  MdDatepickerModule,
  MdNativeDateModule,
  MdPaginatorModule
];

@NgModule({
  imports: materialModules,
  declarations: [],
  exports: materialModules
})
export default class MaterialModule {
}