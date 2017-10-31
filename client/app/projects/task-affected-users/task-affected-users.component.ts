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
        this._savedAffectedUsers = users;
        users.forEach(user => {
            this.addTaskAffectation(user['email']);
        });
    }
    
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
        this.availableUsers.push(this._affectedUsers[index]);
        this._affectedUsers.splice(index, 1);
    };

    private addTaskAffectation(email: string){
        let index = this.findIndexByEmail(this.availableUsers, email);
        this._affectedUsers.push(this.availableUsers[index]);
        this.availableUsers.splice(index, 1);
    };

    public getDifferences(){
        console.log(this._affectedUsers);
        let toAdd = this._affectedUsers.filter((toSaveUser) => {
            let isInList = false;
            this._savedAffectedUsers.forEach((savedUser) => {
                if(savedUser['email'] === toSaveUser['email']){
                    isInList = true;
                }
            });
            return !isInList;
        });

        let toRemove = [];
        this._savedAffectedUsers.forEach((savedUser) => {
            let isInList = false;
            this._affectedUsers.forEach((toSaveUser) => {
                if(savedUser['email'] === toSaveUser['email']){
                    isInList = true;
                }
            });
            if(!isInList){
                toRemove.push(savedUser)
            }
        })

        this._affectedUsers.forEach((user) => {
            
        });
        console.log({
            "toAdd": toAdd,
            "toRemove": toRemove
        });
    }
}