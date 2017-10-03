import { Component, Input } from '@angular/core';
import { DBService } from './../../db/db.service';
import { Observable, Subject } from 'rxjs';

@Component({
  selector: 'hc-task-form',
  templateUrl: 'task-form.component.html',
  styleUrls:  [
    'task-form.component.css'
  ]
})
export class TaskFormComponent {

    @Input() task: object;

    

}