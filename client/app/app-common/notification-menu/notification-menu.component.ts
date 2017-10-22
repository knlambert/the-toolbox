import { Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import { UserInformationsService } from './../../auth/user-informations.service';
import { UserInformations } from './../../auth/user-informations.model';
import { DBService } from './../../db/db.service';
import { NgClass } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'notification-menu',
  templateUrl: 'notification-menu.component.html',
  styleUrls:  ['notification-menu.component.css'],
  providers: [  ]

})
export class MenuNotificationComponent implements OnInit {

  constructor(
    private userInformationsService: UserInformationsService,
    private dbService: DBService
  ){}
  
  private notifications: Array<object> = [];

  private openTask(index: number){
    window.open(this.notifications[index]['link']);
  }

  ngOnInit(){
    this.refresh();
  }
  
  public refresh(){
    this.userInformationsService.onUpdate.subscribe((user: UserInformations) => {
      this.dbService.list("tasks-left", {
        "user_id": user.appUser.id
      }).subscribe((tasks) => {
        this.notifications = tasks;
      });
    });
  }
}
