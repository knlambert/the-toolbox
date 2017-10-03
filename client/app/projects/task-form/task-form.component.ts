import { Component, Input, OnInit, Inject, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { DBService } from './../../db/db.service';
import { Observable, Subject } from 'rxjs';

@Component({
  selector: 'hc-task-form',
  templateUrl: 'task-form.component.html',
  styleUrls:  [
    'task-form.component.css'
  ]
})
export class TaskFormComponent implements OnInit{


    constructor(
      public dialogRef: MdDialogRef<TaskFormComponent>,
      private fb: FormBuilder
    ) {}

    @Input() task: object;
    @Output() onTaskSubmitted = new EventEmitter();

    private form : FormGroup;


    ngOnInit(){
      this.form = this.fb.group({
          'description': [null, Validators.compose([Validators.required])]
      });
    }

    onNoClick(): void {
      this.dialogRef.close(this.task);
    }
    

}