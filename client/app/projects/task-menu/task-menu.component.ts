import { Component, OnInit, Input } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { DBService } from './../../db/db.service';

@Component({
  selector: 'hc-task-menu',
  templateUrl: 'task-menu.component.html',
  styleUrls:  [
    'task-menu.component.css'
  ]
})
export class TaskMenuComponent implements OnInit {

  constructor(private dbService: DBService){}

  @Input() projectId: number;

  private taskLists: Array<object> = [];

  private newTaskList(){
  }

  ngOnInit(){
    this.dbService.list("task-lists", {
      "id": this.projectId
    }).subscribe((items) => {
      items.forEach((value) => {
        this.insertItem(value, "saved");
      });
    });
  }

  private insertItem(value ?: object, status ? : string){
    value = value || {
      "project": {
        "id": this.projectId
      },
      "title": "",
      "completed": 0,
      "end_date": Math.floor(new Date().getTime() / 1000)
    };

    status = status || "new";
    this.taskLists.push({
      "status": status,
      "value": value
    });

  }
}