import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
@Component({
  selector: 'common-simple-filters',
  templateUrl: 'simple-filters.component.html',
  styleUrls:  ['simple-filters.component.css'],
  providers: [  ]

})
export class SimpleFilterscomponent implements OnInit {

  @Input() filters: Array<string>;
  @Output() filterUpdated = new EventEmitter();

  private variables = {};
  private lazyTrigger: any = null;

  ngOnInit(){
    this.filters.forEach((filter) => {
      this.variables[filter] = null;
    });
  }

  private format(filter: string){
    return filter[0].toUpperCase() + filter.substring(1, filter.length);
  }
    
  private onFilterChange(){
    
    if(this.lazyTrigger != null){
      clearTimeout(this.lazyTrigger);
    }

    this.lazyTrigger = setTimeout(() => {
      let values = {};
      for(let key in this.variables){
        let filterVal = this.variables[key];
        if(filterVal != null && filterVal !== ""){
          values[key] = filterVal;
        }
      }
      this.filterUpdated.emit({
        filterValues : values
      });
      this.lazyTrigger = null;
    }, 500);

  }
}
