import { Component, Input } from '@angular/core';
import { DBService } from './../../db/db.service';
import { Observable, Subject } from 'rxjs';

@Component({
  selector: 'hc-task-list',
  templateUrl: 'task-list.component.html',
  styleUrls:  [
    'task-list.component.css'
  ]
})
export class TaskListComponent {

    public taskes: Array<object> = [
        {}, {}, {}, {}, {}
    ];

}