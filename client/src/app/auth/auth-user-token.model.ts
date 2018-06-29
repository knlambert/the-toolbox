
import { AuthRole } from "./auth-role.model";

export class AuthUserToken {
  constructor(
    public id: number,
    public email: string,
    public name: string,
    public exp: number,
    public roles: Array<AuthRole> = []
  ) { };
}
