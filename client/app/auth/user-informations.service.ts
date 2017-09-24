import { Injectable, Output, EventEmitter, OnInit} from '@angular/core';
import { Observable, ReplaySubject }    from 'rxjs';
import { ConnectionService} from './connection.service';
import { TokenService } from './token.service';
import { UserInformations } from './user-informations.model';
import { DBService } from './../db/db.service';
import { AppUser } from './app-user.model';

@Injectable()
export class UserInformationsService {

    private userInformations: UserInformations = null;
    public onUpdate: ReplaySubject<UserInformations> = new ReplaySubject();

    constructor(
        private connectionService: ConnectionService,
        private tokenService: TokenService,
        private dbService: DBService
    ){
        this.refresh();
    }

    public clear(){
        this.tokenService.set(null);
        this.onUpdate.next(null);
    }

    public authentify(login: string, password: string){
        return this.connectionService.authentify(login, password).map(
            (credentials) => {
                this.tokenService.set(credentials);
                this.refresh();
                return credentials;
            }
        )
    }
    
    public refresh(){
        let authUser = this.tokenService.get();
        if(authUser != null){
            let listObs = this.dbService.list("users", {
                "email": authUser.email
            }, {}, 0, 2).subscribe((items) => {
                let authUser = this.tokenService.get();
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
                console.log("Next : " + JSON.stringify(this.userInformations));
                this.onUpdate.next(this.userInformations);
            });
        }
    }

    public updatePassword(password: string){
        return this.connectionService.modifyPassword(this.userInformations.authUser.email, password);
    }
}