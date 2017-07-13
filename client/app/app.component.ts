import { Component, OnInit, ViewChild } from '@angular/core';
import { 
  Router,
  Event as RouterEvent,
  NavigationStart,
  NavigationEnd,
  NavigationCancel,
  NavigationError
} from '@angular/router';
import { MainMenuComponent } from './app-common/main-menu/main-menu.component';
import { TokenService } from './auth/token.service';

@Component({
  selector: 'app',
  templateUrl: 'app.component.html',
  styleUrls:  [
    'app.component.css'
  ]
})
export class AppComponent implements OnInit{
  @ViewChild(MainMenuComponent) mainMenu:MainMenuComponent;
  private isConnected = false;
  private menuConfig = {
    "links": [
      {
        "label" : "My hours",
        "url" : "hours/my-hours"
      },
      {
        "label" : "Projects Load",
        "url" : "hours/project-load"
      },
      {
        "label" : "Backoffice",
        "url" : "backoffice/"
      }
    ],
    "loginUrl": "login/",
    "settingsUrl": "parameters/my-settings"
  };
  private loading: Boolean = true;
  constructor(private router: Router, private tokenService: TokenService) { 
      router.events.subscribe((event: RouterEvent) => {
          this.navigationInterceptor(event);
      });
  }
  navigationInterceptor(event: RouterEvent): void {
        if (event instanceof NavigationStart) {
            this.loading = true;
        }
        if (event instanceof NavigationEnd) {
            this.loading = false;
        }
        // Set loading state to false in both of the below events to hide the spinner in case a request fails
        if (event instanceof NavigationCancel) {
            this.loading = false;
        }
        if (event instanceof NavigationError) {
            this.loading = false;
        }
    }
  ngOnInit(){
    this.isConnected = this.tokenService.get() != null;
    if(!this.isConnected){
      this.router.navigate(['login/']);
    }
  };
  private onConnected(){
    this.isConnected = true;
    this.mainMenu.refresh();
  }
}