import { Component, OnInit, Input, Output, EventEmitter, ViewChild} from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { DBService } from "./../../db/db.service";
import { MdAutocomplete } from '@angular/material';


@Component({
  selector: 'flexible-form',
  templateUrl: 'flexible-form.component.html',
  styleUrls:  ['flexible-form.component.css'],
  providers: [ DBService ]
})
export class FlexibleFormComponent {

  @Input() uuid;
  @Input() isCreated: Boolean;
  @Input() description: Object;
  @Input() value;
  @Input()
  set isEditable(value){
    this._isEditable = value;
    if(this.formGroup != null){
      for(var key in this.formGroup.controls){
        
        if(this._isEditable){
          this.formGroup.controls[key].enable();
        }
        else{
          this.formGroup.controls[key].disable();
        }
      }
    }
  }
  
  @Output() submited = new EventEmitter();
  @Output() canceled = new EventEmitter();
  @Output() edited = new EventEmitter();


  private formGroup : FormGroup;
  private fb: FormBuilder;
  private loaded = false;
  private autoCompletes: object = {};
  private _originalValue;
  private _isEditable: Boolean = false;

  constructor(fb: FormBuilder, private db: DBService){
    this.fb = fb;
  };
  

  get isEditable(){
    return this._isEditable;
  }

  ngOnInit(){
    this.initForm()
    this.isEditable = this._isEditable;
  }

  private toDateTimeStr(timestamp){
    let date = new Date(timestamp * 1000);
    let strDate = (date.getMonth() + 1) + "/";
    strDate += date.getDate() + "/";
    strDate += date.getFullYear() + " ";
    strDate += (date.getHours() < 10 ? '0' : '') + date.getHours() + ":";
    strDate += (date.getMinutes() < 10 ? '0' : '') + date.getMinutes() + ":";
    strDate += (date.getSeconds() < 10 ? '0' : '') + date.getSeconds();
    return strDate;
  };

  private dateValidator(c: FormControl){
    let d = new Date(c['value']);
    if(isNaN(d.getTime())){
      return {
        "dateValidator": true
      }
    }
    else{
      return null;
    }
  };    

  /**
     * Format the placeholder of the form.
     * @param header 
     */
    private formatPlaceHolder(placeholder: string){
      let ret = placeholder.charAt(0).toUpperCase() + placeholder.slice(1);
      return ret.replace("_", " ").replace(".", " ");
  };

  private initForm(){ 
    var that = this;
    this._originalValue = JSON.parse(JSON.stringify(this.value));
    var formGroupConfig = {};
    var validators = [];
    for(var i = 0; i < this.description['fields'].length; i++){
      validators = [];
      
      let field = this.description['fields'][i];
      let value = this.value[field['name']] || null;

      if(field['extra'] !== "auto_increment" || this.isCreated){

        if(field['type'] === 'timestamp'){
          if(value != null){
            value = this.toDateTimeStr(value);
          }
          validators.push(that.dateValidator);
        }
        
        if(field['required']){
          validators.push(Validators.required);
        }
        formGroupConfig[field['name']] = [value, validators];
      }
    }
    this.formGroup = this.fb.group(formGroupConfig);
    this.loaded = true;
  }

  private getFieldConfig(fieldName){
    for(var i = 0; i < this.description['fields'].length; i++){
      if(this.description['fields'][i]['name'] === fieldName){
        return this.description['fields'][i];
      }
    }
    return null;
  }

  private cancelForm(){
    this.value = JSON.parse(JSON.stringify(this._originalValue));
    this.canceled.emit({
      "uuid": this.uuid,
      "value": this.value
    });
  }

  private submitForm(value: any){
    for(var key in value){
      let fieldConfig = this.getFieldConfig(key);
      
      if(value[key] == null){
        delete value[key];
      }
      else{

        if(fieldConfig['type'] === 'timestamp'){
          
          value[key] = parseInt(''+(new Date(value[key])).getTime() / 1000);
        }
      }
    }
    if(this.isCreated){
      value.id = this._originalValue['id'];
      this.edited.emit({
        "uuid": this.uuid,
        "value": value
      })
    }
    else{
      this.submited.emit({
        "uuid": this.uuid,
        "value": value
      });
    }
  };

};
