import { Component, OnInit, ViewChild } from '@angular/core';
import { TokenService} from "./../../auth/token.service";
import { DBService } from "./../../db/db.service";
import { ReportComponent } from './../../app-common/report/report.component';
import { FlexibleFormComponent } from './../../app-common/flexible-form/flexible-form.component';
import { FormGroup, FormsModule, ReactiveFormsModule, FormBuilder, Validators } from "@angular/forms";
import { MdSnackBar } from '@angular/material';
@Component({
  selector: 'backoffice',
  templateUrl: 'backoffice.component.html',
  styleUrls:  ['backoffice.component.css'],
  providers: [DBService ]
})
export class BackofficeComponent implements OnInit{

  constructor(
    private dbService: DBService, 
    private fb: FormBuilder,
    private snackBar: MdSnackBar
    ){};

  @ViewChild('Report') report:ReportComponent;
  private userInformations: string;
  private referentials: object[];
  private referential: String;
  private editingItems: Array<Object>= [];
  private description: Object;  
  private testFormGroup: FormGroup;

  ngOnInit(){
    this.testFormGroup = this.fb.group({
      'project': [null, Validators.required]
    });

    this.referentials = [
      {"service": "projects", "label": "Projects"},
      {"service": "hours", "label": "Hours"},
      {"service": "clients", "label": "Clients"},
      {"service": "users", "label": "Users"},
      {"service": "project_assignements", "label": "Project affectations"},
      {"service": "roles", "label": "Project roles"}
    ]
  };

  ngAfterViewInit(): void {
    this.report.setLoading(true);
    this.refresh(this.referentials[0]['service']);
  };


  private export(referential, filters= {}, page = 0, pageSize = 10, orderBy = {}){
    this.dbService.export(referential, filters);
  };

  private extractFieldsFromDescription(description, parent ? : string){
    var fields = [];
    for(let i = 0; i < description["fields"].length; i++){
      let field = description["fields"][i];
      if (field["nested_description"] != null){
        let nestedDescription = field["nested_description"];
        let updatedParent = (typeof(parent) === "undefined") ? field["name"] : parent + "." + field["name"];
        fields = fields.concat(this.extractFieldsFromDescription(nestedDescription, updatedParent));
      }
      else if (field['key'] !== "mul"){
        fields.push({
          name: (typeof(parent) === "undefined") ? field["name"] : parent + "." + field["name"],
          type: field["type"]
        });
      }
    }
    return fields;
  };

  private reset(referential: string){
    this.report.setLoading(true);
    this.editingItems = [];
    this.report.reset();
    this.refresh(referential);
  };
  
  private refresh(referential, filters= {}, page = 0, pageSize = 10, orderBy = {}){
    
    var that = this;
    this.referential = referential;
    this.dbService.getDescription(referential).subscribe((description) => {

      let fields = that.extractFieldsFromDescription(description);  
      that.description = description;
      that.dbService.list(
        that.referential, 
        filters,
        orderBy,
        page,
        pageSize
      ).subscribe((items) => {
        that.report.setFields(fields);
        that.report.setItems(items);
      });
    });    
  };

  private dbServiceError(operation, err){
    let errorCode = err['error_code'];
    let errMsg = "Impossible to perform this operation.";
    if (typeof(errorCode) != "undefined"){
      if(errorCode === "INTEGRITY_ERROR"){
        if(operation === "WRITE"){
          errMsg = "This entry already exists.";
        }
        else if(operation === "DELETE"){
          errMsg = "You can't delete this (another item depends on it)."
        }
      }
      
    }
    
    if (err['error_code'])
    this.snackBar.open(errMsg, "Dismiss");
    this.report.refresh();
  };

  private delete(selectedObjects: Array<object>){
    let jIds = [];
    for(var i = 0; i < selectedObjects.length; i++){
      jIds.push({
        "id": selectedObjects[i]['object']['id']
      });
    }
    this.dbService.delete(this.referential, {
      "$or": jIds
    }).subscribe(
      (result) => this.report.refresh(),
      (err) => this.dbServiceError("DELETE", err)
    );

  };

  private openEdition(selectedObjects: Array<object>){
    this.editingItems = this.editingItems.concat(selectedObjects);
  };

  private closeEdition(selectedObjects: Array<object>){
    this.editingItems = this.editingItems.filter((item) => {
      for(var i = 0; i < selectedObjects.length; i++){
        if(selectedObjects[i]['uuid'] === item['uuid']){
          return false;
        }
      }
      return true;
    });
  }

  private create(obj: any){
    let that = this;
    this.dbService.save(this.referential, obj['value']).subscribe(
      (result) => {
        that.report.refresh();
        that.closeEdition([obj]);
      },
      (err) => this.dbServiceError("WRITE", err));
  };

  private edit(obj: any){

    this.dbService.update(this.referential, {
      id: obj['value']['id']
    }, obj['value']).subscribe(
      (result) => {
        this.report.refresh();
        this.closeEdition([obj]);
      },
      (err) => this.dbServiceError("WRITE", err));
  };

  private cancel(obj: any){
    this.closeEdition([obj]);
  };
}
