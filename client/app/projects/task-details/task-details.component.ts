import { Component, Input, OnInit, Inject, Output, EventEmitter } from '@angular/core';
import { Location } from '@angular/common';
import { DBService } from './../../db/db.service';
import { Observable, Subject, ReplaySubject } from 'rxjs';

@Component({
  selector: 'hc-task-details',
  templateUrl: 'task-details.component.html',
  styleUrls:  [
    'task-details.component.css'
  ]
})
export class TaskDetailsComponent implements OnInit{


    constructor(
      private location: Location,
      private dbService: DBService
    ) {}

    @Input() task: object;
    @Output() taskSubmit = new EventEmitter();
    @Output() taskPrevious = new EventEmitter();
    @Output() taskTitleDescriptionUpdate = new EventEmitter();

    private affectedUsers: Array<object> = [];
    private availableUsers: Array<object> = [];
    private locked: boolean = true;

    ngOnInit(){
      this.location.go("projects/" + this.task['task_list']['project']['id'] + "/tasks/" + this.task['id']);
      if(this.task['title'] === ""){
        this.locked = false;
      }
      this.refreshAffectedUser();
      this.updateAvailableMembers();
    }

    onNoClick(): void {}

    
    private updateAvailableMembers(excludedUserEmails: Array<string> = []){
      let and = [];
      and.push({
        "project.id": this.task['task_list']['project']['id']
      });
      return this.dbService.list("project_assignements", {
          "project.id": this.task['task_list']['project']['id']
        }, {"user.name": 1, "user.id": -1}).map((items) => {
          return items.map((item) => {
            return item['user'];
          });
        }).subscribe((users) => {
        this.availableUsers = users;
      });
    }

    private refreshAffectedUser(){
      this.dbService.list("task-assignements", {
        "task.id": this.task['id']
      }).subscribe((assignements) => {
        this.affectedUsers = assignements.map((item) => {
          return item['user'];
        });
      });
    }

    private updateField(key: string, value: any){
      let update = {};
      update[key] = value;
      this.dbService.update("tasks", {
        "id": this.task['id']
      },update).subscribe(() => {});
    }

    private doPrevious(){
      this.taskPrevious.emit({
        "task": this.task
      });
    }

    private doUnlock(){
      this.locked = false;
    }

    private doSave(){
      this.locked = true;
      this.taskTitleDescriptionUpdate.emit({
        "taskId": this.task['id'],
        "title": this.task['title'],
        "description": this.task['description']
      });
    }
}