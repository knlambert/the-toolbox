import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Router }   from '@angular/router';
import { MdSnackBar } from '@angular/material';
import { UserInformationsService } from './../user-informations.service';

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
    private userInformationsService: UserInformationsService,
    private router: Router,
    public snackBar: MdSnackBar
  ) { }

  ngOnInit(){}
  public connect(){
    
    this.loading = true;

    this.userInformationsService.authentify(
      this.login,
      this.password
    ).subscribe(
      (credentials) => {
        this.router.navigate(["hours/mine/now"]);
        this.connected.emit();
        this.loading = false;
      },
      (err) => {
        this.snackBar.open('Login or password incorrect', 'DISMISS', {
          duration: 5000,
        });
        this.loading = false;
      });
  }
}
