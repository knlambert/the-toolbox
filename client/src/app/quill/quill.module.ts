import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuillEditorComponent } from './quill-editor/quill-editor.component';

@NgModule({
  declarations: [
    QuillEditorComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [QuillEditorComponent],
  providers: []
})
export class QuillModule { }

