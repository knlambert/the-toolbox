
import { Subject ,  Observable } from 'rxjs';
import { DBService } from './../../db/db.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { UserInformations } from './../../auth/user-informations.model';
import { UserInformationsService } from './../../auth/user-informations.service';
import { Component, Input, OnInit, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { HoursCalendarDayComponent } from './../hours-calendar-day/hours-calendar-day.component';

@Component({
  selector: 'hours-calendar',
  templateUrl: 'hours-calendar.component.html',
  styleUrls: ['hours-calendar.component.css'],
  providers: []

})
export class HoursCalendarComponent implements OnInit {

  @Input() userInformations: UserInformations;
  @Input() daysPerPage = 7;
  @Input() hideWeekend = false;

  private hoursCount = 0;
  private minHoursPerWeek = 0;
  private sizePerDay = '19%';

  @ViewChildren('calendardayComponent') calendardayComponents: QueryList<HoursCalendarDayComponent>;


  constructor(
    private userInformationsService: UserInformationsService,
    private dbService: DBService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  private currentDate: Date;
  public dayHoursList = new Subject();

  public getFormatedWeek() {
    return this.currentDate.getDate() + '/' + (this.currentDate.getMonth() + 1) + '/' + this.currentDate.getFullYear() + ' week'
  }

  public next() {
    this.updateUri(+7);
  }

  public previous() {
    this.updateUri(-7);
  }

  public exportCra() {
    const month = this.currentDate.getMonth() + 1;

    this.dbService.export('cras', {
      email: this.userInformations.appUser.email,
      month: month
    });
  }

  public updateUri(days: number) {
    const newdate = new Date(this.currentDate.getTime() + (3600 * 24 * 1000 * days));
    const newDateStr = newdate.getFullYear() + '-' + (newdate.getMonth() + 1) + '-' + newdate.getDate();
    this.hoursCount = 0;
    this.router.navigate(['hours/mine/', newDateStr]);
  }

  public ngOnInit() {

    this.userInformationsService.onUpdate.subscribe((userInformations: UserInformations) => {

      if (userInformations == null) {
        return;
      }
      this.userInformations = userInformations;
      this.minHoursPerWeek = this.userInformations.appUser.min_hours_per_week;
      this.route.paramMap.subscribe((params: ParamMap) => {
        // (+) before `params.get()` turns the string into a number
        const strDate = params.get('date');
        if (strDate === 'now') {
          this.currentDate = new Date();
          this.currentDate.setDate(this.currentDate.getDate() - this.currentDate.getDay() + 1);

        } else {
          this.currentDate = new Date(strDate + " 00:00:00");
        }
        this.currentDate.setHours(0);
        this.currentDate.setMinutes(0);
        this.currentDate.setSeconds(0);
        let currentTimestamp = this.currentDate.getTime() / 1000;
        this.dbService.list('hours', {
          'started_at': {
            '$gte': Math.floor(currentTimestamp),
            '$lt':  Math.floor(currentTimestamp + (this.daysPerPage * 24 * 3600))
          },
          'affected_to.id': this.userInformations.appUser.id
        }, {
            'started_at': 1
          }).subscribe((hours) => {
            const days = [];
            const cursorDay = new Date(this.currentDate);
            for (let i = 0; i < this.daysPerPage; i++) {
              const cursorTimestamp = Math.floor(cursorDay.getTime() / 1000);
              days.push({
                'day': new Date(cursorDay),
                'hours': hours.filter((hour) => {
                  return hour['started_at'] >= cursorTimestamp && hour['started_at'] < (cursorTimestamp + (3600 * 24));
                })
              });
              cursorDay.setDate(cursorDay.getDate() + 1);
            }
            this.dayHoursList.next(days);
          });
      });
    });
  }

  private getSelectedItems() {
    let selectedItems = [];
    this.calendardayComponents.forEach(element => {
      selectedItems = selectedItems.concat(element.getSelectedItems());
    });
    return selectedItems;
  }

  private applyToEachSelectedItem(callback: any) {
    const items = this.getSelectedItems();
    this.calendardayComponents.forEach(element => {
      for (let i = items.length - 1; i >= 0; i--) {
        if (callback(items[i], element) !== -1) {
          items.splice(i, 1);
        }
      }
    });
  }

  public deleteSelectedTasks() {
    const itemsToDelete = this.getSelectedItems();
    const itemsToSetLoading = itemsToDelete.slice();

    this.applyToEachSelectedItem((item, element) => {
      return element.setLoading(item['uuid'], true);
    });

    const orFilter = [];
    itemsToDelete.forEach((item) => {
      orFilter.push({
        'id': item['hour']['id']
      });
    });

    if (orFilter.length > 0) {
      this.dbService.delete('hours', {
        '$and': [
          {
            'affected_to.id': this.userInformations['app_user_id']
          }, {
            '$or': orFilter
          }
        ]
      }).subscribe((result) => {
        this.applyToEachSelectedItem((item, element) => {
          return element.deleteItem(item['uuid']);
        });
      });
    }
  }

  private isWeekend(date: Date) {
    return date.getDay() === 0 || date.getDay() === 6;
  }

  private onHideWeekChange(hideWeekend: boolean) {
    if (hideWeekend) {
      this.sizePerDay = '13%';
    } else {
      this.sizePerDay = '19%';
    }
  }

  private computeHoursCounts(oldValue: number, newValue: number) {
    this.hoursCount = this.hoursCount - oldValue + newValue;
  }


}
