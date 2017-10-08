import { Component, Input, OnInit, Inject, Output, EventEmitter } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
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
      public dialogRef: MatDialogRef<TaskDetailsComponent>,
      private dbService: DBService
    ) {}

    @Input() task: object;
    @Output() onTaskSubmitted = new EventEmitter();

    private searchedMember: any;
    private availableUsers: Array<object> = [];
    private affectedUsers = new Subject();

    ngOnInit(){
      this.refreshAffectedUser();
      this.updateAvailableMembers();
    }

    onNoClick(): void {
      this.dialogRef.close(this.task);
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
      and.push({
        "project.id": this.task['task_list']['project']['id']
      });
      excludedUserEmails.forEach((email) => {
        and.push({
          "user.email": {
            "$ne": email
          }
        });
      });
      return this.dbService.list("project_assignements", {"$and": and}, {"user.name": 1, "user.id": -1}).subscribe((items) => {
        this.availableUsers = items.map((item) => {
          return item['user'];
        });
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
}