import { Component, OnInit, ViewChild } from '@angular/core';
import { DBService } from './../../db/db.service';
import { ReportComponent } from './../../app-common/report/report.component';
import { FlexibleFormComponent } from './../../app-common/flexible-form/flexible-form.component';
import { FormGroup, FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
@Component({
  selector: 'backoffice',
  templateUrl: 'backoffice.component.html',
  styleUrls: ['backoffice.component.css'],
  providers: [DBService]
})
export class BackofficeComponent implements OnInit {

  constructor(
    private dbService: DBService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) { }

  @ViewChild('Report') report: ReportComponent;
  private userInformations: string;
  public referentials: object[];
  public referential: String;
  public editingItems: Array<Object> = [];
  private description: Object;
  private testFormGroup: FormGroup;

  ngOnInit() {
    this.testFormGroup = this.fb.group({
      'project': [null, Validators.required]
    });

    this.referentials = [
      // { 'service': '_users', 'label': 'Users' },
      { 'service': 'clients', 'label': 'Clients' },
      { 'service': 'projects', 'label': 'Projects' },
      { 'service': 'hours', 'label': 'Hours' },
      { 'service': 'project_assignements', 'label': 'Project affectations' },
      { 'service': 'roles', 'label': 'Project roles' },
      { 'service': 'tags', 'label': 'Task tags' }
    ]
  }

  ngAfterViewInit(): void {
    this.report.setLoading(true);
    this.refresh(this.referentials[0]['service']);
  }

  public export(referential, filters = {}, page = 0, pageSize = 10, orderBy = {}) {
    this.dbService.export(referential, filters);
  }

  private extractFieldsFromDescription(description, parent?: string) {
    let fields = [];
    for (let i = 0; i < description['fields'].length; i++) {
      const field = description['fields'][i];
      if (field['nested_description'] != null) {
        const nestedDescription = field['nested_description'];
        const updatedParent = (typeof (parent) === 'undefined') ? field['name'] : parent + '.' + field['name'];
        fields = fields.concat(this.extractFieldsFromDescription(nestedDescription, updatedParent));
      } else if (field['key'] !== 'mul') {
        fields.push({
          name: (typeof (parent) === 'undefined') ? field['name'] : parent + '.' + field['name'],
          type: field['type']
        });
      }
    }
    return fields;
  }

  public reset(referential: string) {
    this.report.setLoading(true);
    this.editingItems = [];
    this.report.reset();
    this.refresh(referential);
  }

  public refresh(referential, filters = {}, page = 0, pageSize = 10, orderBy = {}) {

    this.referential = referential;
    this.dbService.getDescription(referential).subscribe((description) => {

      const fields = this.extractFieldsFromDescription(description);
      this.description = description;
      this.dbService.list(
        this.referential,
        filters,
        orderBy,
        page,
        pageSize
      ).subscribe((items) => {
        this.report.setFields(fields);
        this.report.setItems(items);
      });
    });
  }

  private dbServiceError(operation, err) {
    const errorCode = err['error_code'];
    let errMsg = 'Impossible to perform this operation.';
    if (typeof (errorCode) !== 'undefined') {
      if (errorCode === 'INTEGRITY_ERROR') {
        if (operation === 'WRITE') {
          errMsg = 'This entry already exists.';
        } else if (operation === 'DELETE') {
          errMsg = 'You can\'t delete this (another item depends on it).';
        }
      }

    }

    if (err['error_code']) {
      this.snackBar.open(errMsg, 'DISMISS', {
        duration: 5000,
      });
    }
    this.report.refresh();
  }

  public delete(selectedObjects: Array<object>) {
    const jIds = [];
    for (let i = 0; i < selectedObjects.length; i++) {
      jIds.push({
        'id': selectedObjects[i]['object']['id']
      });
    }
    this.dbService.delete(this.referential, {
      '$or': jIds
    }).subscribe(
      (result) => this.report.refresh(),
      (err) => this.dbServiceError('DELETE', err)
      );

  }

  public openEdition(selectedObjects: Array<object>) {
    this.editingItems = this.editingItems.concat(selectedObjects);
  }

  private closeEdition(selectedObjects: Array<object>) {
    this.editingItems = this.editingItems.filter((item) => {
      for (let i = 0; i < selectedObjects.length; i++) {
        if (selectedObjects[i]['uuid'] === item['uuid']) {
          return false;
        }
      }
      return true;
    });
  }

  private create(obj: any) {
    this.dbService.save(this.referential, obj['value']).subscribe(
      (result) => {
        this.report.refresh();
        this.closeEdition([obj]);
      },
      (err) => this.dbServiceError('WRITE', err));
  }

  private edit(obj: any) {

    this.dbService.update(this.referential, {
      id: obj['value']['id']
    }, obj['value']).subscribe(
      (result) => {
        this.report.refresh();
        this.closeEdition([obj]);
      },
      (err) => this.dbServiceError('WRITE', err));
  }

  private cancel(obj: any) {
    this.closeEdition([obj]);
  }
}
