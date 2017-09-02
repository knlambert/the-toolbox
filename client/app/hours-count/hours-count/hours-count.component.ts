import { Component, OnInit } from '@angular/core';
import { Router }   from '@angular/router';
import { TokenService} from "./../../auth/token.service";
import { DBService } from './../../db/db.service';

@Component({
  selector: 'hours-count',
  templateUrl: 'hours-count.component.html',
  styleUrls:  ['hours-count.component.css'],
  providers: []
})
export class HoursCountComponent implements OnInit{

  private userInformations: object = null;

  constructor(private tokenService: TokenService, private router: Router, private dbService: DBService){

    this.tokenService.tokenModified.subscribe((credentials) => {
      this.updateUserInformation();
    });
  }

  private updateUserInformation(){
    let userInformations = this.tokenService.get();
    this.dbService.list('users', {
      email: userInformations['email']
    }).subscribe((items) => {
      if(items.length === 1){
        userInformations['app_user_id'] = items[0]['id'];
        this.userInformations = userInformations;
      }
    })
  }

  ngOnInit(){
    this.updateUserInformation();
  }

}
