import { Component, OnInit, Input } from '@angular/core';
import { DBService } from './../../db/db.service';
import { Observable, Subject } from 'rxjs';

@Component({
  selector: 'hc-task-list',
  templateUrl: 'task-list.component.html',
  styleUrls:  [
    'task-list.component.css'
  ]
})
export class TaskListComponent implements OnInit{

    constructor(private dbService: DBService){}
    
    @Input() taskList: object;

    private tasks: Observable<Array<object>>;

    ngOnInit(){
      this.tasks = this.dbService.list("tasks", {
        "task_list.id": this.taskList["id"]
      });
    }

}