import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Router }   from '@angular/router';
import {MdSnackBar} from '@angular/material';
import { ConnectionService } from './../connection.service';
import { TokenService } from './../token.service';

@Component({
  selector: 'login',
  templateUrl: 'login.component.html',
  styleUrls:  ['login.component.css'],
  providers: [  ]
})
export class LoginComponent implements OnInit{
  public login: string;
  public password: string;
  public message: string
  public loading;
  @Output() connected = new EventEmitter();

  constructor(
    private connectionService: ConnectionService,
    private tokenService: TokenService,
    private router: Router,
    public snackBar: MdSnackBar
  ) { }

  ngOnInit(){}
  public connect(){
    
    var _this = this;
    this.loading = true;

    this.connectionService.authentify(
      this.login,
      this.password
    ).subscribe(
      (credentials) => {
        _this.tokenService.set(credentials);
        _this.router.navigate(["hours/mine/now"]);
        _this.connected.emit();
        _this.loading = false;
      },
      (err) => {
        _this.snackBar.open('Login or password incorrect', 'DISMISS', {
          duration: 5000,
        });
        _this.loading = false;
      });
  }
}
