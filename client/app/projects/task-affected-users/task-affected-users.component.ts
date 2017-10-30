import { Component, Input, OnInit, Inject, Output, EventEmitter } from '@angular/core';
import { Location } from '@angular/common';
import { DBService } from './../../db/db.service';
import { Observable, Subject, ReplaySubject } from 'rxjs';

@Component({
  selector: 'hc-task-affected-users',
  templateUrl: 'task-affected-users.component.html',
  styleUrls:  [
    'task-affected-users.component.css'
  ]
})
export class TaskAffectedUsersComponent implements OnInit {

    @Input() availableUsers: Array<object>;
    @Input() locked: boolean;
    @Input() set savedAffectedUsers(users){
        this._affectedUsers = users;
    }
    
    private _affectedUsers: Array<object> = [];

    private _toAdd: Array<object> = [];
    private _toRemove: Array<object> = [];

    ngOnInit(){ }

    private findIndexByEmail(tab: Array<object>, email: string){
        for(var i = 0; i < tab.length; i++){
            if(tab[i]['email'] === email){
                return i;
            }
        }
        return -1;
    }

    private deleteTaskAffectation(email: string){
        let index = this.findIndexByEmail(this._affectedUsers, email);
        this._toRemove.push(this._affectedUsers[index]);
        this.availableUsers.push(this._affectedUsers[index]);
        this._affectedUsers.splice(index, 1);
    };

    private onMemberSearched(email: string){
        let index = this.findIndexByEmail(this.availableUsers, email);
        this._toAdd.push(this.availableUsers[index]);
        this._affectedUsers.push(this._affectedUsers[index]);
        this.availableUsers.splice(index, 1);
    };
}