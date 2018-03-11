import { AuthUserToken } from './auth-user-token.model';
import { AppUser } from './app-user.model';

export class UserInformations {
  constructor(public authUser: AuthUserToken, public appUser: AppUser) { };
}
