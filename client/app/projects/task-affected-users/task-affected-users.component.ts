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
        console.log(users)
        this._savedAffectedUsers = users;
        this._affectedUsers = [];
        this._availableUsers = this.availableUsers;
        users.forEach(user => {
            this.addTaskAffectation(user['email']);
        });
    }
    
    private _availableUsers: Array<object> = [];
    private _affectedUsers: Array<object> = [];
    private _savedAffectedUsers: Array<object> = [];

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
        this._availableUsers.push(this._affectedUsers[index]);
        this._affectedUsers.splice(index, 1);
    };

    private addTaskAffectation(email: string){
        let index = this.findIndexByEmail(this._availableUsers, email);
        this._affectedUsers.push(this._availableUsers[index]);
        this._availableUsers.splice(index, 1);
    };

    public getChanges(){
        let affectedUsersEmails = this._affectedUsers.map((user) => user['email']);
        let savedUsersEmails = this._savedAffectedUsers.map((user) => user['email']);
        return {
            "toAdd": this._affectedUsers.filter((toSaveUser) => savedUsersEmails.indexOf(toSaveUser['email']) === -1),
            "toRemove": this._savedAffectedUsers.filter((toSaveUser) => affectedUsersEmails.indexOf(toSaveUser['email']) === -1)
        };
    }
}