import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { UsersService } from './../users.service';
import { } from './../../auth/user-informations.service'
import { UsersListItemComponent } from "./../users-list-item/users-list-item.component";

@Component({
  selector: 'hc-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css']
})
export class UsersListComponent implements OnInit {

  constructor(
    private usersService: UsersService,
    private router: Router
  ) { }

  ngOnInit() {
    this.refreshUsers();
  }

  private users: Array<object> = [];
  private hasNext: boolean = false;
  
  public itemComponent = UsersListItemComponent;

  private onFiltersUpdated(update: {search : string}){
    this.refreshUsers(update.search);
  }
  
  private refreshUsers(filterValue: string = null){
    this.usersService.list(filterValue, filterValue).subscribe((result) => {
      this.users = result.users;
      this.hasNext = result.hasNext;
    });
  }
  private newUser(){
    this.router.navigate(['/users/new']);
  }

}
