import { Component, OnInit } from '@angular/core';
import { Router }   from '@angular/router';
import { ConnectionService } from "./../../auth/connection.service";
import { TokenService } from "./../../auth/token.service";
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
    private connectionService: ConnectionService, 
    private tokenService: TokenService,
    private snackBar: MdSnackBar
    ){}

  ngOnInit(){  }

  private modifyPassword(password){
    let credentials = this.tokenService.get();
    var _this = this;
    this.connectionService.modifyPassword(credentials['email'], password).subscribe((result) => {
      _this.snackBar.open('Password changed.', 'DISMISS', {
        duration: 5000,
      });
    });

  }

}
