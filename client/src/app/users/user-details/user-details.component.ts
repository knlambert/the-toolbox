import { AuthUser } from "./../../auth/auth-user.model";
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { AuthUsersService } from '../../auth/auth-users.service';
@Component({
  selector: 'hc-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css']
})
export class UserDetailsComponent implements OnInit {

  constructor(
    private activatedRoute: ActivatedRoute,
    private authUserService: AuthUsersService,
    private router: Router
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
   * @param authUser 
   */
  public createUser(authUser: AuthUser){
    this.authUserService.register(authUser).subscribe((createdUser: AuthUser) => {
      console.log(createdUser);
      this.previous();
    });
  }

  /**
   * Update the user in the user API ref.
   * @param authUser 
   */
  public editUser(authUser: AuthUser){
    this.authUserService.update(authUser).subscribe((editedUser: AuthUser) => {
      console.log(editedUser);
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
