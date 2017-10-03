import { Component, Input, OnInit, Inject, Output, EventEmitter } from '@angular/core';
import { MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
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
      public dialogRef: MdDialogRef<TaskDetailsComponent>,
      private dbService: DBService
    ) {}

    @Input() task: object;
    @Output() onTaskSubmitted = new EventEmitter();

    private searchedMember: any;
    private availableUsers: Array<object> = [];
    private affectedUsers = new Subject();

    ngOnInit(){
      this.refreshAffectedUser();
    }

    onNoClick(): void {
      this.dialogRef.close(this.task);
    }

    private refreshAffectedUser(){
      this.dbService.list("task-assignements", {
        "task.id": this.task['value']['id']
      }).subscribe((items) => this.affectedUsers.next(items));
    }

    private updateAvailableMembers(name: string = null){
        let filters = (name != null && name != "" && typeof(name) !== "object") ? {"name": {"$regex": name}}: {};
        return this.dbService.list("users", filters, {"name": 1, "id": -1}).subscribe((items) => {
          this.availableUsers = items;
        });

    }

    private onMemberSearched(user){
      if(typeof(user) === "object"){
        this.searchedMember = "";
        this.dbService.save("task-assignements", {
          "user": user,
          "task": this.task['value']
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
        "id": this.task['value']['id']
      },update).subscribe(() => {});
    }
}