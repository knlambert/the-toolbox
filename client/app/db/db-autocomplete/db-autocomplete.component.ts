import { Component, OnInit, Input, Output, EventEmitter, ViewChild, forwardRef} from '@angular/core';
import { Router }   from '@angular/router';
import { FormControl, FormGroup, FormBuilder, Validators, ControlValueAccessor, NG_VALUE_ACCESSOR , NG_VALIDATORS} from "@angular/forms";
import { DBService } from './../db.service';

@Component({
  selector: 'db-autocomplete',
  templateUrl: 'db-autocomplete.component.html',
  styleUrls: ['db-autocomplete.component.css'],
  providers: [
    { 
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DBAutocompleteComponent),
      multi: true
    },
    { 
      provide: NG_VALIDATORS,
      useValue: (c: FormControl) => {
        let err = {
          selectionError: {
            given: null
          }
        };
        return typeof(c.value) !== "object" ? err : null;
      },
      multi: true
    },
    DBService
  ]
})
export class DBAutocompleteComponent implements ControlValueAccessor {

  constructor(private dbService: DBService){}

  @Input() db: string;
  @Input() labelField: string;
  @Input() query: object = null;
  @Output() selected = new EventEmitter();

  @Input('selectedValue')
  set selectedValue(val) {
    let that = this;
    if(typeof(val) === "string" && val.length > 1){
      this.refreshAutocomplete(val);
      that._selectedValue = val;
      that.propagateChange(this._selectedValue);
    }
    else if (typeof(val) === "object"){
      this.validate(val, (valid) => {
        if(valid){
          that._selectedValue = val;
          this.selected.emit({
            "selected": this._selectedValue
          });
          that.propagateChange(this._selectedValue);
        }
      })
    }
    else{
      that._selectedValue = val;
      that.propagateChange(this._selectedValue);
    }

    
  }

  private _selectedValue = null;


  private values = [];

  propagateChange = (_: any) => {};

  get selectedValue() {
    return this._selectedValue;
  };

  private getName(){
    return this.db;
  };
  
  private refreshAutocomplete(val: string){
    var that = this;
    let pattern = {
      $and: []
    };
    let reg = {};
    reg[this.labelField] = { $regex: ".*" + val + ".*"};
    pattern.$and.push(reg);
    if(this.query != null){
      pattern.$and.push(this.query);
    }
    
    this.dbService.list(this.db, pattern).subscribe((result) => {
      that.values = result;
    })
  };

  private validate(val: string, callback){
    if(val != null && val['id'] != null){
      let pattern = {
        id: val['id']
      };
      this.dbService.list(this.db, pattern).subscribe((result) => {
        if(result.length === 1){
          callback(true);
        }
        else{
          callback(false);
        }
      })
    }
    else{
      callback(false);
    }
  }

  
  private generateGetLabel(labelField: string){
    var labelField = labelField;
    return function(obj: any): string {
      return obj ? obj[labelField] : "";
    }
  }

  private getLabel(obj: any): string {
    return obj ? obj[this.labelField] : "";
  };


  /* Implements ControlValueAccessor interface */
  writeValue(value: any) {
    if (value !== undefined) {
        this.selectedValue = value;
    }
  }

  registerOnChange(fn) {
    this.propagateChange = fn;
  }

  registerOnTouched() {}

}
