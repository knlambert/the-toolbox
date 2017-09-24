import { AuthUser } from './auth-user.model';
import { AppUser } from './app-user.model';

export class UserInformations {
    constructor(public authUser: AuthUser, public appUser: AppUser){};
}