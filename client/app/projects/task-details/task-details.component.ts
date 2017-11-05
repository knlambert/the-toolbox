import { Component, Input, OnInit, Inject, Output, EventEmitter, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { DBService } from './../../db/db.service';
import { Observable, Subject, ReplaySubject } from 'rxjs';
import { EntityAffectationComponent } from '../entity-affectation/entity-affectation.component';
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

    @ViewChild("affectedUsersComponent") affectedUsersComponent: EntityAffectationComponent;
    @ViewChild("affectedTagsComponent") affectedTagsComponent: EntityAffectationComponent;


    private affectedUsers: Array<object> = [];
    private affectedTags: Array<object> = [];
    private availableUsers: Array<object> = [];
    private availableTags: Array<object> = [];
    private locked: boolean = true;

    ngOnInit(){
      this.location.go("projects/" + this.task['task_list']['project']['id'] + "/tasks/" + this.task['id']);
      if(this.task['title'] === ""){
        this.locked = false;
      }

      this.refreshAvailableMembers().subscribe((availableUsers) => {
        this.availableUsers = availableUsers;
        this.refreshAffectedUser().subscribe((affectedUsers) => {
          this.affectedUsers = affectedUsers.map((item) => {
            return item['user'];
          });
        });
      });

      this.refreshAvailableTags().subscribe((availableTags) => {
        this.availableTags = availableTags;
        this.refreshAffectedTags().subscribe((affectedTags) => {
          this.affectedTags = affectedTags.map((item) => {
            return item['tag'];
          });
        });
      });
    }

    onNoClick(): void {}

    private refreshAvailableTags(){
      return this.dbService.list("tags");
    }

    private refreshAffectedTags(){
      return this.dbService.list("task-tags", {
        "task.id": this.task['id']
      });
    }

    private refreshAvailableMembers(){
      return this.dbService.list("project_assignements", {
        "project.id": this.task['task_list']['project']['id']
      }, {"user.name": 1, "user.id": -1}).map((items) => {
        return items.map((item) => {
          return item['user'];
        });
      });
    }

    private refreshAffectedUser(){
      return this.dbService.list("task-assignements", {
        "task.id": this.task['id']
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
        "description": this.task['description'],
        "affectedUsersChanges": this.affectedUsersComponent.getChanges(true),
        "affectedTagsChanges": this.affectedTagsComponent.getChanges(true)
      });
    }
}