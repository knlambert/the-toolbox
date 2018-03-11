import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { GoogleColorsService } from './../../app-common/google-colors.service';

@Component({
  selector: 'hc-users-list-item',
  templateUrl: './users-list-item.component.html',
  styleUrls: ['./users-list-item.component.css']
})
export class UsersListItemComponent implements OnInit {

  constructor(private router: Router, private googleColorsService: GoogleColorsService) { }

  @Input()
  value: object;

  ngOnInit() {
    
  }

  /**
   * Get a color for the user.
   * @param email The user color is generated from this email.
   */
  public getUserColor(email: string) {
    return this.googleColorsService.generate(email, '600');
  }

  public openUser() {
    this.router.navigate(['/users/' + this.value['id']]);
  }

}
