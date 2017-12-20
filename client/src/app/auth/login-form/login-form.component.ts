import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'login-form',
  templateUrl: 'login-form.component.html',
  styleUrls: ['login-form.component.css']
})
export class LoginFormComponent implements OnInit {

  @Output() submitted = new EventEmitter();

  public login: string;
  public password: string;

  ngOnInit() {

  }
}
