import { UserInformationsService } from './../../auth/user-informations.service';
import { Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MenuNotificationComponent } from './../notification-menu/notification-menu.component';
import { NgClass } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'main-menu',
  templateUrl: 'main-menu.component.html',
  styleUrls:  ['main-menu.component.css'],
  providers: [  ]

})
export class MainMenuComponent implements OnInit
{


  constructor(
    private userInformationsService: UserInformationsService, 
    private dialog: MatDialog,
    private router: Router
  ) {}

  @Input() config;
  @Output() openNotifications = new EventEmitter();

  private isOpen: boolean = false;
  private userInformations;

  ngOnInit(){
    this.userInformationsService.onUpdate.subscribe((userInformations) => {
      this.userInformations = userInformations;
      if(this.userInformations == null){
        this.router.navigate([this.config['loginUrl']]);
      }
      else{
        if(window.location.pathname === this.config['loginUrl'] || window.location.pathname === "/"){
          this.router.navigate([this.config['defaultUrl']]);
        }
      }
    });
  }

  private logout(){
    this.userInformationsService.clear().subscribe((result) => {
      this.router.navigate([this.config['loginUrl']]);
    });
  }

  private settings(){
    this.router.navigate([this.config['settingsUrl']]);
  }


  private toggle(){
    this.isOpen = !this.isOpen;
  }

  public close(){
    this.isOpen = false;
  }

  private route(){
    this.toggle();
  }

  private doOpenNotification(){
    this.openNotifications.emit({});
    let dialogRef = this.dialog.open(MenuNotificationComponent, {
      data: {}
    });
    dialogRef.componentInstance.refresh();


  }

}
