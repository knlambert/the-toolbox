import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { AuthUsersService } from './../../auth/auth-users.service';

import { } from './../../auth/user-informations.service'
import { UsersListItemComponent } from "./../users-list-item/users-list-item.component";

@Component({
  selector: 'hc-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css']
})
export class UsersListComponent implements OnInit {

  constructor(
    private authUsersService: AuthUsersService,
    private router: Router
  ) { }

  ngOnInit() {
    this.refreshUsers();
  }

  public offset = 0;
  public callSize: number = 16;
  public hasNext: boolean = false;
  private users: Array<object> = [];
  public isLoading: boolean = false;
  
  public itemComponent = UsersListItemComponent;

  private onFiltersUpdated(update: {search : string}){
    this.offset = 0;
    this.users = [];
    this.refreshUsers(update.search);
  }
  
  private refreshUsers(filterValue: string = null){
    this.isLoading = true;
    this.authUsersService.list(
      filterValue, filterValue, this.offset, this.callSize
    ).subscribe((result) => {
      this.users = this.users.concat(result.users);
      this.hasNext = result.hasNext;
      this.isLoading = false;
    });
  }
  
  private newUser(){
    this.router.navigate(['/users/new']);
  }

  public loadMore() {
    this.offset += this.callSize;
    this.refreshUsers();
  }

}
