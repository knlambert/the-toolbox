import { Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import {NgClass} from '@angular/common';
import { Router } from '@angular/router';
import { TokenService } from './../../auth/token.service';

@Component({
  selector: 'main-menu',
  templateUrl: 'main-menu.component.html',
  styleUrls:  ['main-menu.component.css'],
  providers: [  ]

})
export class MainMenuComponent implements OnInit
{


  constructor(private tokenService: TokenService, private router: Router) { }

  private isOpen: boolean = false;
  private userInformations;
  @Input() config;

  ngOnInit(){
    this.refresh();
    this.tokenService.tokenModified.subscribe((credentials) => {
      this.refresh();
    });

  };


  public refresh(){
    var _this = this;
    this.userInformations = this.tokenService.get();
    let relUrl = window.location.pathname;
    if (relUrl === "/login" || relUrl === "/"){
      this.router.navigate(["/hours/mine/now"]);
    }
  }

  private logout(){
    this.tokenService.set(null);
    this.userInformations = null;
    this.router.navigate([this.config['loginUrl']]);
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
}
