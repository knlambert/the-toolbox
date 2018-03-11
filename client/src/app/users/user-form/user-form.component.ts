import { AuthUser } from '../../auth/auth-user.model';
import { AuthRole } from '../../auth/auth-role.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'hc-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent implements OnInit {
  /**
   * UserFormComponent contains the form to supply the fields
   * used in the user API.
   * Note that roles are handled in a different form.
   */

  @Input() authUser: AuthUser;
  public form: FormGroup;
  public isCreated: boolean = false;
  public availableRoles: Array<AuthRole> = [
    new AuthRole(1, "admin", "Admin")
  ];
  
  constructor(
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    if (!this.isCreated) {
      this.authUser = new AuthUser(
        null,
        "",
        "",
        true,
        []
      )
    }
    this.form = this.fb.group({
      'id': [this.authUser.id],
      'email': [this.authUser.email, Validators.compose([Validators.email, Validators.required])],
      'name': [this.authUser.name, Validators.compose([Validators.required])],
      'active': [this.authUser.active, Validators.compose([Validators.required])],
      'roles': [this.authUser.roles]
    });
  }

  private submitForm(value: AuthUser){
    console.log(value)
  }

}
