import { Component, Input, OnInit, Inject, Output, EventEmitter } from '@angular/core';
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
      private dbService: DBService
    ) {}

    @Input() task: object;
    @Output() taskSubmit = new EventEmitter();
    @Output() taskPrevious = new EventEmitter();
    @Output() taskTitleDescriptionUpdate = new EventEmitter();

    private searchedMember: any;
    private availableUsers: Array<object> = [];
    private affectedUsers = new Subject();
    private locked: boolean = true;

    ngOnInit(){
      this.refreshAffectedUser();
      this.updateAvailableMembers();
      if(this.task['title'] === ""){
        this.locked = false;
      }
    }

    onNoClick(): void {
    }

    private refreshAffectedUser(){
      this.dbService.list("task-assignements", {
        "task.id": this.task['id']
      }).subscribe((assignements) => {
        this.updateAvailableMembers(assignements.map((item) => {
          return item["user"]["email"];
        }));
        this.affectedUsers.next(assignements)
      });
    }

    private updateAvailableMembers(excludedUserEmails: Array<string> = []){
      let and = [];
      excludedUserEmails.forEach((email) => {
        and.push({
          "user.email": {
            "$ne": email
          }
        });
      });
      return this.dbService.list("project_assignements", {
          "project.id": this.task['task_list']['project']['id'], 
          "$and": and
        }, {"user.name": 1, "user.id": -1}).map((items) => {
          return items.map((item) => {
            return item['user'];
          });
        }).subscribe((users) => {
        this.availableUsers = users;
      });
    }

    private onMemberSearched(user){
      if(typeof(user) === "object"){
        this.searchedMember = null;
        this.dbService.save("task-assignements", {
          "user": user,
          "task": this.task
        }).subscribe(() => {
          this.refreshAffectedUser();
        });
        user = "";
      }
      else{
        this.updateAvailableMembers(user);
      }
      
    }
    
    private getName(obj: any): string {
      return obj ? obj.name : "";
    }

    private deleteTaskAffectation(taskAffectationid: number){
      this.dbService.delete("task-assignements", {
        "id": taskAffectationid
      }).subscribe(() => {
        this.refreshAffectedUser();
      })
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