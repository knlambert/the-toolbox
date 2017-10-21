import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { DBService } from './../../db/db.service';
import { Observable, Subject } from 'rxjs';
import { UserInformationsService } from './../../auth/user-informations.service';
import { UserInformations } from './../../auth/user-informations.model';




@Component({
  selector: 'hc-task-comment',
  templateUrl: 'task-comment.component.html',
  styleUrls:  [
    'task-comment.component.css'
  ]
})
export class TaskCommentComponent implements OnInit {

    constructor(
      private dbService: DBService,
      private userInformationsService: UserInformationsService){}

    @Input() index: number;
    @Input() comment: object;  
    @Input() locked: boolean = true;
    @Output() delete = new EventEmitter();
    @Output() cancel = new EventEmitter();
    @Output() submit = new EventEmitter();

    public get jsDate(){
      if(typeof(this.comment) !== "undefined"){
        return  new Date(this.comment['created_at'] * 1000);
      }
      return null;
    }
    public get commentDate(){
      let date = this.jsDate;
      return date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate();
    }

    public get commentHour(){
      let date = this.jsDate;
      return date.getHours() + ":" + (date.getMinutes());
    }

    ngOnInit(){
      this.userInformationsService.onUpdate.subscribe((userInformatons: UserInformations) => {
        this.comment['author'] = userInformatons.appUser;
      });
    }
    public toggleEditMode(){
      this.locked = !this.locked;
    }

    public doDelete(){
      this.delete.emit({
        index: this.index
      });
    }

    private doCancel(){
      this.cancel.emit();
    }

    private doSubmit(){
      this.submit.emit({
        comment: this.comment
      });
    }
}