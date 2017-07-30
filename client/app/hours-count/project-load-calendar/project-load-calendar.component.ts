import { 
  Component, 
  OnInit, 
  Input, 
  Output, 
  EventEmitter
} from '@angular/core';





@Component({
  selector: 'hc-project-load-calendar',
  templateUrl: 'project-load-calendar.component.html',
  styleUrls:  [
    'project-load-calendar.component.css'
  ]
})
export class ProjectLoadCalendarComponent implements OnInit{

    private loadPerUser = [];
    private monthsBinding = {
      1: "January",
      2: "Fabruary",
      3: "March",
      4: "April",
      5: "May",
      6: "June",
      7: "July",
      8: "August",
      9: "September",
      10: "October",
      11: "November",
      12: "December"
    };

    @Input() load: Object = {};
    @Input() daysHeaders: Array<Object> = [];
    @Input() displayMode: string = 'days';
    @Output() deleted = new EventEmitter();

    @Input()
    set data(data: Array<any>) {
      data = data || [];
      var loadPerUser = [];
      var loadForUser = []
      var userId = null;
      var lastUserId = null;
      for(var i = 0; i < data.length; i++){
        if(lastUserId != null && lastUserId !== data[i]['affected_to']['id']){
          loadPerUser.push(loadForUser);
          loadForUser = [];
        };
        lastUserId = data[i]['affected_to']['id'];
        loadForUser.push(data[i]);
      }
      loadPerUser.push(loadForUser);
      this.loadPerUser = loadPerUser;
    }
    
    

    private getLoad(userLoad: Array<Object>, dayTimestamp: number){
      for(var i = 0; i < userLoad.length; i++){
        if(dayTimestamp >= userLoad[i]['timestamp'] -(3600 * 24) && dayTimestamp < userLoad[i]['timestamp']){
          return userLoad[i]['hour'];
        }
      }
      return "-";
    }

    private getMonth(timestamp: number){
      let date = new Date(timestamp * 1000);
      if(date.getDate() === 1){
        return this.monthsBinding[date.getMonth()+1];
      }
      return ""
    }

    ngOnInit(){
      let consumed = this.load['project']['consumed'] / 8;
      let provisionedHours = this.load['project']['provisioned_hours'] / 8;
      
      this.load['project']['consumedDays'] = Math.round(consumed * 10) / 10;
      this.load['project']['provisionedDays'] = Math.round(provisionedHours * 10) / 10;
      
    }

    public delete(){
      this.deleted.emit(
        {deletedProjectId: this.load['project']['id']}
      );
    }
}