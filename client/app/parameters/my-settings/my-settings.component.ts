import { Component, OnInit } from '@angular/core';
import { Router }   from '@angular/router';
import { UserInformationsService } from "./../../auth/user-informations.service";
import {MdSnackBar} from '@angular/material';
@Component({
  selector: 'dtb-my-settings',
  templateUrl: 'my-settings.component.html',
  styleUrls:  ['my-settings.component.css'],
  providers: []
})
export class MySettingsComponent implements OnInit{

  private userInformations: string;

  constructor(
    private userInformationsService: UserInformationsService,
    private snackBar: MdSnackBar
    ){}

  ngOnInit(){  }

  private updatePassword(password: string){
    this.userInformationsService.updatePassword(password).subscribe(() => {
      this.snackBar.open('Password changed.', 'DISMISS');
    }, (err) => {
      this.snackBar.open("Error", 'DISMISS');
    });
  }

}
