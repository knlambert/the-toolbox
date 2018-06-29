
import { AuthRole } from "./auth-role.model";

export class AuthUser {
  constructor(
    public id: number = null,
    public email: string,
    public name: string,
    public active: boolean,
    public roles: Array<AuthRole> = []
  ) {};

  public toJSON(){
    return {
      "id": this.id,
      "email": this.email,
      "name": this.name,
      "active": this.active,
      "roles": this.roles.map((role: AuthRole) => {
        return role.toJSON();
      })
    }
  }
}
