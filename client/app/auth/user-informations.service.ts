import { Injectable, Output, EventEmitter, OnInit} from '@angular/core';
import { Observable, ReplaySubject }    from 'rxjs';
import { ConnectionService} from './connection.service';
import { UserInformations } from './user-informations.model';
import { Router } from '@angular/router';
import { TokenService } from './token.service';
import { DBService } from './../db/db.service';
import { AppUser } from './app-user.model';
import { AuthUser } from './auth-user.model';

@Injectable()
export class UserInformationsService {

    private userInformations: UserInformations = null;
    public onUpdate: ReplaySubject<UserInformations> = new ReplaySubject();

    constructor(
        private connectionService: ConnectionService,
        private tokenService: TokenService,
        private dbService: DBService,
        private router: Router
    ){
        var authUser = this.tokenService.get();
        if(authUser != null){
            this.refresh(authUser);
        }
        else{
            this.router.navigate(['login']);
        }
    }

    public clear(){
        this.tokenService.set(null);
        this.connectionService.logout().subscribe(() => {
            this.onUpdate.next(null);
        });
    }

    public authentify(login: string, password: string){
        return this.connectionService.authentify(login, password).map(
            (payload) => {
                let authUser = new AuthUser(
                    payload['id'],
                    payload['email'],
                    payload['name'],
                    payload['exp']
                )
                this.tokenService.set(authUser);
                this.refresh(authUser);
            }
        )
    }
    
    public refresh(authUser: AuthUser){
        if(authUser != null){
            let listObs = this.dbService.list("users", {
                "email": authUser.email
            }, {}, 0, 2).subscribe((items) => {
                if(items.length == 1){
                    let appUser = new AppUser(
                        items[0].id,
                        items[0].email,
                        items[0].name
                    );
                    this.userInformations = new UserInformations(
                        authUser, 
                        appUser
                    )
                }
                this.onUpdate.next(this.userInformations);
            });
        }
        else{
            this.onUpdate.next(null);
        }
    }

    public updatePassword(password: string){
        return this.connectionService.modifyPassword(this.userInformations.authUser.email, password);
    }
}