import { Component, OnInit } from '@angular/core';
import { Router }   from '@angular/router';
import { UserInformationsService } from "./../../auth/user-informations.service";
import {MatSnackBar} from '@angular/material';
import { AppUser } from './../../auth/app-user.model';
@Component({
  selector: 'dtb-my-settings',
  templateUrl: 'my-settings.component.html',
  styleUrls:  ['my-settings.component.css'],
  providers: []
})
export class MySettingsComponent implements OnInit{

  private userInformations: string;
  private appUser: AppUser;

  constructor(
    private userInformationsService: UserInformationsService,
    private snackBar: MatSnackBar
  ){}

  ngOnInit(){
    this.userInformationsService.onUpdate.subscribe((user) => {
      this.appUser = user.appUser;
    })
  }

  private updatePassword(password: string){
    this.userInformationsService.updatePassword(password).subscribe(() => {
      this.snackBar.open('Password changed.', 'DISMISS',{
        duration: 5000,
      });
    }, (err) => {
      this.snackBar.open("Error.", 'DISMISS',{
        duration: 5000,
      });
    });
  }

  private updateAppParameters(value: object){
    this.userInformationsService.updateParameters(value).subscribe(() => {
      this.snackBar.open('User parameters changed.', 'DISMISS',{
        duration: 5000,
      });
    }, (err) => {
      this.snackBar.open("Error.", 'DISMISS',{
        duration: 5000,
      });
    });
  }

}
