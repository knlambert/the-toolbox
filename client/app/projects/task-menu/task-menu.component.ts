import { Component, Input } from '@angular/core';
import { DBService } from './../../db/db.service';
import { Observable, Subject } from 'rxjs';

@Component({
  selector: 'hc-task-menu',
  templateUrl: 'task-menu.component.html',
  styleUrls:  [
    'task-menu.component.css'
  ]
})
export class TaskMenuComponent {

  private lists: Array<object> = [
    {
      "test": "test"
    },{
      "test": "test"
    },{
      "test": "test"
    },{
      "test": "test"
    },{
      "test": "test"
    },{
      "test": "test"
    }
  ];
}