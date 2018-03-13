import { AuthUser } from '../../auth/auth-user.model';
import { AuthRole } from '../../auth/auth-role.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

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

  @Input() authUser: AuthUser = null;
  @Output() userCreate = new EventEmitter();
  @Output() userEdit = new EventEmitter();
  @Output() cancel = new EventEmitter();

  public form: FormGroup;
  public availableRoles: Array<AuthRole> = [
    new AuthRole(1, "admin", "Admin")
  ];
  
  constructor(
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    var isNewUser = (this.authUser.id == null)
    this.form = this.fb.group({
      'id': [this.authUser.id],
      'email': [{"value": this.authUser.email, "disabled": !isNewUser}, Validators.compose([Validators.email, Validators.required])],
      'name': [this.authUser.name, Validators.compose([Validators.required])],
      'resetPassword': [{"value": isNewUser, "disabled": isNewUser}],
      'password': ["", Validators.compose([Validators.minLength(6)])],
      'active': [this.authUser.active, Validators.compose([Validators.required])],
      'roles': [this.authUser.roles.map((role: AuthRole) => {
        return role.id;
      })]
    });
  }

  /**
   * Submit the form by triggering an Output.
   * @param authUser The submitted AuthUser. 
   */
  private submitForm(value: object){

    let authUser = new AuthUser(
      value['id'],
      value['email'] || this.authUser.email,
      value['name'],
      value['active'],
      value['roles'].map((roleId) => {
        return new AuthRole(roleId, "", "");
      })
    );
    let output = {
      "authUser": authUser
    };
    if (value["resetPassword"] == null || value["resetPassword"] === true){
      output["newPassword"] = value["password"];
    }
    
    if(this.authUser.id == null){
      this.userCreate.emit(output);
    }
    else{
      this.userEdit.emit(output);
    }
  }

  /**
   * Go to the users menu.
   */
  public previous() {
    this.cancel.emit();
  }

}
