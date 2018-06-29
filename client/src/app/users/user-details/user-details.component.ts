import { Component, OnInit } from '@angular/core';
import { AuthUser } from "./../../auth/auth-user.model";
import { AuthUsersService } from '../../auth/auth-users.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';

@Component({
  selector: 'hc-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css']
})
export class UserDetailsComponent implements OnInit {

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private authUserService: AuthUsersService
  ) { }

  public authUser: AuthUser = null;

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe((params: ParamMap) => {
      const userId = parseInt(params.get('id'), 0);
      if (!isNaN(userId)) {
        this.authUserService.get(userId).subscribe((authUser: AuthUser) => {
          this.authUser = authUser;
        });
      } else {
        this.authUser = new AuthUser(
          null,
          "",
          "",
          true,
          []
        );
      }
    });
  }

  /**
   * Create a user in the user API ref.
   * @param authUser The user to create.
   * @param password The password to modify.
   */
  public createUser(authUser: AuthUser, password: string){
    this.authUserService.register(authUser, password).subscribe((createdUser: AuthUser) => {
      this.previous();
    });
  }

  /**
   * Update the user in the user API ref.
   * @param authUser The user to update.
   * @param password The password to modify.
   */
  public editUser(authUser: AuthUser, password: string){
    this.authUserService.update(authUser, password).subscribe((editedUser: AuthUser) => {
      this.previous();
    })
  }

  /**
   * Go back to the users menu.
   */
  public previous(){
    this.router.navigate(['/users']);
  }

}
