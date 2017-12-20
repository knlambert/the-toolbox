import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { DBService } from './../../db/db.service';
import { Observable, Subject } from 'rxjs';

@Component({
  selector: 'hc-task-list-item',
  templateUrl: 'task-list-item.component.html',
  styleUrls:  [
    'task-list-item.component.css'
  ]
})
export class TaskListItemComponent implements OnInit {

  constructor(private dbService: DBService){}

  @Output() onDeletedTask = new EventEmitter();
  @Input() set task(task: object){
    this._task = task;
    this.loadTags();
  }
  
  private _task: object;
  private formatedTags: Array<object> = [];
  
  ngOnInit(){}

  private loadTags(){
    this.formatedTags = [];
    let tagNames = this._task["tag_names"] == null ? [] : this._task["tag_names"].split(",");
    let tagColors = this._task["tag_colors"] == null ? [] : this._task["tag_colors"].split(",");
    for(var i = 0; i < tagNames.length; i++){
      this.formatedTags.push({
        "name": tagNames[i],
        "color": tagColors[i]
      });
    }
  }

  
  private openTask(taskId: number){}

  private deleteTask(taskId: number){
    this.onDeletedTask.emit({
      taskId: this._task['id']
    });
  }

}