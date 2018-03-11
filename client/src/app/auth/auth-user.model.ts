
import { AuthRole } from "./auth-role.model";

export class AuthUser {
  constructor(
    public id: number = null,
    public email: string,
    public name: string,
    public active: boolean,
    public roles: Array<AuthRole> = []
  ) { };
}
