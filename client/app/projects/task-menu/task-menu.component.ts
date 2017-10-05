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
      "project.id": this.projectId
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

    if(status === "new"){
      this.dbService.save("task-lists", value).subscribe((saved) => {
        value['id'] = saved['inserted_id'];
        this.taskLists.push({
          "status": "saved",
          "value": value
        });
      });
    }
    else{
      this.taskLists.push({
        "status": "saved",
        "value": value
      });
    }
  }

  private fetchItemPosition(taskListId: number){
    for(var i = 0; i < this.taskLists.length; i++){
      if(this.taskLists[i]['value']['id'] === taskListId){
        return i;
      }
    }
  }

  private deleteTaskList(taskListId: number){
    let position = this.fetchItemPosition(taskListId);
    this.dbService.delete("task-lists", {
      "id": taskListId
    }).subscribe((result) => {
      this.taskLists.splice(position, 1);
    });
  }
}