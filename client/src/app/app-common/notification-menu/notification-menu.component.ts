import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { UserInformationsService } from './../../auth/user-informations.service';
import { UserInformations } from './../../auth/user-informations.model';
import { Router } from '@angular/router';
import { DBService } from './../../db/db.service';
import { NgClass } from '@angular/common';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'notification-menu',
  templateUrl: 'notification-menu.component.html',
  styleUrls: ['notification-menu.component.css'],
  providers: []

})
export class MenuNotificationComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<MenuNotificationComponent>,
    private userInformationsService: UserInformationsService,
    private dbService: DBService,
    private router: Router
  ) { }


  public notifications: Array<object> = [];
  public loading = true;

  private openTask(index: number) {
    this.router.navigate([this.notifications[index]['link']]);
    this.dialogRef.close();
  }

  ngOnInit() {
    this.refresh();
  }

  /**
   * Refresh the notifications.
   */
  public refresh() {
    this.loading = true;
    this.userInformationsService.onUpdate.subscribe((user: UserInformations) => {
      this.dbService.list('tasks-left', {
        'user_id': user.appUser.id
      }).subscribe((tasks) => {
        this.notifications = tasks;
        this.loading = false;
      });
    });
  }
}
