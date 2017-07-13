import { Component, OnInit, ViewChild, ElementRef, AfterContentChecked, EventEmitter, Output, Input} from '@angular/core';
import { DBService } from "./../../db/db.service";
import { MdSnackBar} from '@angular/material';


@Component({
  selector: 'hc-planning',
  templateUrl: 'planning.component.html',
  styleUrls:  [
    'planning.component.css'
  ]
})
export class PlanningComponent implements OnInit, AfterContentChecked {

    @Input() private from: Date = new Date();

    @ViewChild('container') container:ElementRef;
    @ViewChild('content') content:ElementRef;

    private initialized: boolean = false;
    private scrolled: number = 0;
    private lastScrollLeft = 0;

    

    /* Options */
    private cellSize = 50;
    private maxColumnCount = 90;
    private maxLineCount = 90;

    private addedCellsCount = 30;
    private monthsBinding = {
      1: "January",
      2: "February",
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

    
    private assignations: Array<object>;

    private days = [];

    private generateGrid(days: Array<Date>){
       
        let assignements = [];

        for(let l = 0; l < this.maxLineCount; l++){
            let assignement = {
                user: {"name": " - "},
                task: {
                    name: " - ",
                    days: []  
                }
            };
            days.forEach((day) => {
                assignement['task']['days'].push({
                    "display": " - ",
                    "timestamp": day.getTime()
                })
            });
            assignements.push(assignement);
        }
        
        return assignements;
    }

    private generateDaysFrom(from: Date = new Date()){
        let days = [];
        for(var i = this.maxColumnCount;  i > 0; i--){

            days.push(new Date(from.getTime()));
            from.setDate(from.getDate() + 1);
        }
        return days;
    }

    private centerScrollbar(){
        let containerElem =  this.container.nativeElement;
        let contentElem = this.content.nativeElement;
        this.lastScrollLeft = (contentElem.offsetWidth - containerElem.offsetWidth) / 2;
        containerElem.scrollLeft  = this.lastScrollLeft;
        if(!this.initialized && containerElem.scrollWidth !== 0){
            this.initialized = true;
        }
    }

    private getMonth(timestamp: number){
      let date = new Date(timestamp);
      if(date.getDate() === 1){
        return this.monthsBinding[date.getMonth()+1];
      }
      return ""
    }

    ngAfterContentChecked(){
       if(!this.initialized){
           this.centerScrollbar();
       }
    }

    ngOnInit(){
        this.days = this.generateDaysFrom(this.from);
        this.assignations = this.generateGrid(this.days);
    }

    private addCell(rightDirection: boolean){
        if(rightDirection){
            let lastDate = this.days[this.days.length-1];
            var newDate = new Date(lastDate.getTime());
            newDate.setDate(newDate.getDate() + 1);
            /* add */
            this.days.push(newDate)
            this.days.splice(0, 1);
            this.scrolled -= this.cellSize;
        }
        else{
            let firstDate = this.days[0];
            var newDate = new Date(firstDate.getTime());
            newDate.setDate(newDate.getDate() - 1);
            /* add */
            this.days.unshift(newDate)
            this.days.splice(-1, 1);
            this.scrolled += this.cellSize;
        }

         for(let l = 0; l < this.maxLineCount; l++){
            let row = this.assignations[l]['task']['days'];
            if(rightDirection){
                /* add */
                row.push({
                    "display": " - ",
                    "timestamp": newDate.getTime()
                });
                /* remove */
                row.splice(0, 1);
            }
            else{
                /* add */
                row.unshift({
                    "display": " - ",
                    "timestamp": newDate.getTime()
                });
                /* remove */
                row.splice(-1, 1);
            }
        }
        

    }

    private onScroll(event){
        let containerElem =  this.container.nativeElement;
        let contentElem = this.content.nativeElement;
        let maxScrollLeft = contentElem.offsetWidth - containerElem.offsetWidth;
        let scrollLeft = event.srcElement.scrollLeft;
        this.lastScrollLeft = scrollLeft;

        if(containerElem.scrollLeft === 0 || Math.round(containerElem.scrollLeft) >= maxScrollLeft){
            let toRightDirection = (containerElem.scrollLeft !== 0);
            
            for(var i = this.addedCellsCount; i > 0; i--){
                this.addCell(toRightDirection); 
            }

            if(toRightDirection){
                containerElem.scrollLeft -= this.addedCellsCount * this.cellSize;
            }
            else{
                containerElem.scrollLeft += this.addedCellsCount * this.cellSize;
            }
        }
    }
    
}