import { Component, OnInit } from '@angular/core';
import { Router }   from '@angular/router';
import { TokenService} from "./../../auth/token.service";

@Component({
  selector: 'hours-count',
  templateUrl: 'hours-count.component.html',
  styleUrls:  ['hours-count.component.css'],
  providers: []
})
export class HoursCountComponent implements OnInit{

  private userInformations: string;

  constructor(private tokenService: TokenService, private router: Router){

    this.tokenService.tokenModified.subscribe((credentials) => {
      this.userInformations = this.tokenService.get();
    });
  }

  ngOnInit(){


    this.userInformations = this.tokenService.get();


  }

}
