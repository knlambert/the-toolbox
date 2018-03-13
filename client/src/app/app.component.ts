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


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: [
    'app.component.css'
  ]
})
export class AppComponent implements OnInit {

  constructor(
    private router: Router
  ) {
    router.events.subscribe((event: RouterEvent) => {
      this.navigationInterceptor(event);
    });
  }

  @ViewChild(MainMenuComponent) mainMenu: MainMenuComponent;
  public menuConfig = {
    'links': [
      {
        'icon': 'access_time',
        'label': 'My hours',
        'url': 'hours/mine/now/'
      },
      {
        'icon': 'work',
        'label': 'Projects',
        'url': 'projects/'
      },
      {
        'icon': 'tune',
        'label': 'Backoffice',
        'url': 'backoffice/',
        'roles': ['admin']
      },{
        'icon': 'people',
        'label': 'Users',
        'url': 'users/',
        'roles': ['admin']
      }
    ],
    'loginUrl': '/login',
    'settingsUrl': '/parameters/my-settings',
    'defaultUrl': '/hours/mine/now'
  };
  public loading: Boolean = true;

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
  ngOnInit() {}
}
