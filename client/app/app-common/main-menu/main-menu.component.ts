import { Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import {NgClass} from '@angular/common';
import { Router } from '@angular/router';
import { UserInformationsService } from './../../auth/user-informations.service';

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
    private router: Router
  ) {}

  private isOpen: boolean = false;
  private userInformations;
  @Input() config;

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
  };

 

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
}
