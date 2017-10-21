import { Component, OnInit, Input, ViewChildren, QueryList } from '@angular/core';
import { Router } from '@angular/router';
import { TaskListComponent } from './../task-list/task-list.component';
import { Observable, Subject } from 'rxjs';
import { DBService } from './../../db/db.service';
import { UserInformationsService } from './../../auth/user-informations.service';

@Component({
  selector: 'hc-task-menu',
  templateUrl: 'task-menu.component.html',
  styleUrls:  [
    'task-menu.component.css'
  ]
})
export class TaskMenuComponent implements OnInit {

  constructor(
    private dbService: DBService,
    private userInformationsService: UserInformationsService,
    private router: Router
  ){}

  @Input() projectId: number;
  @ViewChildren('taskListComponent') taskListComponents:QueryList<TaskListComponent>;

  private taskLists: Array<object> = [];
  private openedTask: object = null;
  private uncompletedTasksOnly: boolean = false;
  
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

  private openTask(task: object){
    this.openedTask = task;
  }

  private closeTask(task: object){
    this.openedTask = null;
    this.taskListComponents.forEach((component: TaskListComponent) => {
      if(component.taskList['id'] === task['task_list']['id']){
        component.updateTaskItem(task['id']);
      }
    });
  }

  /**
   * Update title & description for the task. Triggered by task detail component.
   * @param taskId The ID of the task to update.
   * @param title The title to update.
   * @param description The description to update.
   */
  private updateTaskTitleDescription(taskId: number, title: string, description: string){
    this.dbService.update("tasks", {
      "id": taskId
    }, {
      "title": title,
      "description": description
    }).subscribe();
  }
}