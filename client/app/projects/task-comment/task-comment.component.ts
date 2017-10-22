import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { DBService } from './../../db/db.service';
import { Observable, Subject } from 'rxjs';
import { UserInformationsService } from './../../auth/user-informations.service';
import { UserInformations } from './../../auth/user-informations.model';
import { GoogleColorsService } from './../../app-common/google-colors.service';



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
      private userInformationsService: UserInformationsService,
      private googleColorsService: GoogleColorsService
    ){}

    @Input() index: number;
    @Input() comment: object;  
    @Input() locked: boolean = true;
    
    @Output() delete = new EventEmitter();
    @Output() cancel = new EventEmitter();
    @Output() submit = new EventEmitter();

    private userColor: string = "white";
    private isConnectedUserAuthor: boolean = false;
    private isNew: boolean = true;

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
      return  ("0" + date.getHours()).slice(-2) + ":" + ("0" + date.getMinutes()).slice(-2);
    }

    ngOnInit(){
      this.userInformationsService.onUpdate.subscribe((userInformations: UserInformations) => {
        if(typeof(this.comment['id']) === "undefined"){
          this.comment['author'] = userInformations.appUser;
        }
        else {
          this.isConnectedUserAuthor = (this.comment['author']['id'] === userInformations.appUser.id);
          this.isNew = false;
        }

        this.userColor = this.googleColorsService.generate(this.comment['author']['id'], "100");
      });
    }

    /**
     * Unlocks form.
     */
    public toggleEditMode(){
      this.locked = !this.locked;
    }

    /**
     * Trigger delete event to notify parent components.
     */
    public doDelete(){
      this.delete.emit({
        index: this.index
      });
    }

    /**
     * Trigger cancel event to notify parent components.
     */
    private doCancel(){
      this.cancel.emit();
    }

    /**
     * Trigger submission event to notify parent components.
     */
    private doSubmit(){
      this.submit.emit({
        "isNew": this.isNew,
        "comment": this.comment
      });
      this.locked = true;
    }

}