import {
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter
} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { MatSnackBar } from '@angular/material';
import { DBService } from './../../db/db.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';


@Component({
  selector: 'hc-project-member-form',
  templateUrl: 'project-member-form.component.html',
  styleUrls: [
    'project-member-form.component.css'
  ]
})
export class ProjectMemberFormComponent implements OnInit {

  constructor(
    private dbService: DBService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) { }

  @Input() projectId: number;
  public form: FormGroup;
  public locked = false;
  public roles = this.dbService.list('roles').map((roles) => {
    return roles;
  });
  public users: Array<object> = [];

  @Output() memberCreate = new EventEmitter();
  @Output() cancel = new EventEmitter();

  ngOnInit() {
    this.form = this.fb.group({
      'user': [null, Validators.compose([Validators.required])],
      'role': [null, Validators.compose([Validators.required])]
    });

    this.form.controls['user'].valueChanges.startWith(null).subscribe(name => {
      this.updateUsers(name).subscribe((result => {
        this.users = result;
      }));
    });
  }

  private updateUsers(name: string = null) {
    const filters = (name != null && name !== '' && typeof (name) !== 'object') ? { 'name': { '$regex': name } } : {};
    return this.dbService.list('users', filters, { 'name': 1, 'id': -1 });
  }

  public getName(obj: any): string {
    return obj ? obj.name : '';
  }

  public submitForm(value: object) {
    if (this.form.valid) {
      this.locked = true;
      value['project'] = {
        'id': this.projectId
      };
      this.dbService.save('project_assignements', value).subscribe((result) => {
        value['id'] = result['inserted_id'];
        this.memberCreate.emit({
          'member': value
        });
      }, (error) => {
        this.snackBar.open('Member already registered.', 'DISMISS', {
          duration: 5000,
        });
        this.locked = false;
      });
    }
  }

  public doCancel() {
    this.cancel.emit({});
  }
}

