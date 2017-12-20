import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DBService } from './../../db/db.service';
@Component({
  selector: '[hc-project-load-line]',
  templateUrl: 'project-load-line.component.html',
  styleUrls: [
    'project-load-line.component.css'
  ]
})
export class ProjecLoadLineComponent {

  @Input() userId: number;

  public days: Array<object> = [];
  /* null, low, medium, high */
  private activityThresholds = [];
  /**
   * Insert user load into the component.
   * @param from Insert from this date.
   * @param to Insert until this date.
   * @param userLoad The userload to insert.
   */
  public insertUserLoad(from: Date, to: Date, userLoad: Array<object>) {
    userLoad = userLoad.sort((a: object, b: object) => {
      return a['timestamp'] - b['timestamp'];
    });

    const days = [];
    const dateVar = new Date(from);
    while (dateVar < to) {
      let found = false;
      if (userLoad.length > 0) {
        const loadDate = new Date(userLoad[0]['timestamp'] * 1000);
        if (
          loadDate.getFullYear() === dateVar.getFullYear() &&
          loadDate.getMonth() === dateVar.getMonth() &&
          loadDate.getDate() === dateVar.getDate()
        ) {
          const hours = userLoad[0]['hours'];
          let color = '';
          if (hours > 0 && hours < 3) {
            color = 'activity-low';
          } else if (hours >= 3 && hours < 6) {
            color = 'activity-medium';
          } else if (hours >= 6) {
            color = 'activity-high';
          }
          userLoad[0]['class'] = color;
          userLoad[0]['hours'] = Math.round(hours * 10) / 10;
          days.push(userLoad[0]);
          userLoad.splice(0, 1);
          found = true;
        }
      }
      if (!found) {
        const dayWeek = dateVar.getDay();
        days.push({
          'timestamp': Math.floor(dateVar.getTime() / 1000),
          'hours': '-',
          'class': (dayWeek === 6 || dayWeek === 0) ? 'activity-weekend' : ''
        });
      }
      dateVar.setDate(dateVar.getDate() + 1);
    }
    this.days = this.days.concat(days);
  }
}
