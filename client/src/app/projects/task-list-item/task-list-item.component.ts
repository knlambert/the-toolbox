import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { DBService } from './../../db/db.service';
import { Observable, Subject } from 'rxjs';

@Component({
  selector: 'hc-task-list-item',
  templateUrl: 'task-list-item.component.html',
  styleUrls: [
    'task-list-item.component.css'
  ]
})
export class TaskListItemComponent implements OnInit {

  constructor(private dbService: DBService) { }

  @Output() taskDelete = new EventEmitter();
  @Input() set task(task: object) {
    this._task = task;
    this.loadTags();
  }

  public _task: object;
  public formatedTags: Array<object> = [];

  ngOnInit() { }

  private loadTags() {
    this.formatedTags = [];
    const tagNames = this._task['tag_names'] == null ? [] : this._task['tag_names'].split(',');
    const tagColors = this._task['tag_colors'] == null ? [] : this._task['tag_colors'].split(',');
    for (let i = 0; i < tagNames.length; i++) {
      this.formatedTags.push({
        'name': tagNames[i],
        'color': tagColors[i]
      });
    }
  }


  private openTask(taskId: number) { }

  public deleteTask(taskId: number) {
    this.taskDelete.emit({
      taskId: this._task['id']
    });
  }

}
