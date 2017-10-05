import { Component, OnInit } from '@angular/core';
import { Router }   from '@angular/router';
import { UserInformationsService } from "./../../auth/user-informations.service";
import {MdSnackBar} from '@angular/material';
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
    private snackBar: MdSnackBar
  ){}

  ngOnInit(){
    this.userInformationsService.onUpdate.subscribe((user) => {
      this.appUser = user.appUser;
    })
  }

  private updatePassword(password: string){
    this.userInformationsService.updatePassword(password).subscribe(() => {
      this.snackBar.open('Password changed.', 'DISMISS');
    }, (err) => {
      this.snackBar.open("Error", 'DISMISS');
    });
  }

  private updateAppParameters(value: object){
    this.userInformationsService.updateParameters(value).subscribe(() => {
      this.snackBar.open('User parameters changed.', 'DISMISS');
    }, (err) => {
      this.snackBar.open("Error", 'DISMISS');
    });
  }

}
