import {
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter
} from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { MatSnackBar } from '@angular/material';
import { DBService } from './../../db/db.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserInformationsService } from './../../auth/user-informations.service';

@Component({
  selector: 'hc-project-form',
  templateUrl: 'project-form.component.html',
  styleUrls: [
    'project-form.component.css'
  ]
})
export class ProjectFormComponent implements OnInit {

  constructor(
    private dbService: DBService,
    private userInformationsService: UserInformationsService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private router: Router
  ) { }
  public form: FormGroup;
  public clients: Array<object> = [];
  public locked = false;

  @Input() value: object;
  @Input() userId: number;
  @Output() projectCreate = new EventEmitter();
  @Output() projectEdit = new EventEmitter();

  ngOnInit() {
    this.form = this.fb.group({
      'id': [null, Validators.compose([])],
      'client': [null, Validators.compose([Validators.required])],
      'name': [null, Validators.compose([Validators.required])],
      'started_at': [null, Validators.compose([Validators.required])],
      'days': [null, Validators.compose([Validators.required])],
      'code': [null, Validators.compose([])]
    });

    this.form.controls['client'].valueChanges.subscribe(name => {
      this.updateClients(name).subscribe((result => {
        this.clients = result;
      }));
    });

    if (this.value != null) {
      this.form.controls['id'].setValue(this.value['id']);
      this.form.controls['client'].setValue(this.value['client']);
      this.form.controls['name'].setValue(this.value['name']);
      this.form.controls['started_at'].setValue(new Date(this.value['started_at'] * 1000));
      this.form.controls['days'].setValue(Math.floor(this.value['provisioned_hours'] / 8));
      this.form.controls['code'].setValue(this.value['code']);
    }
  }

  private updateClients(name: string = null) {
    const filters = (name != null && name !== '' && typeof (name) !== 'object') ? { 'name': { '$regex': name } } : {};
    return this.dbService.list('clients', filters, { 'name': 1, 'id': -1 });
  }

  public getName(obj: any): string {

    return obj ? obj.name : '';
  }

  public previous() {
    this.router.navigate(['/projects/']);
  }

  public submitForm(value: object) {

    if (this.form.valid) {
      this.locked = true;
      const project = {
        'id': value['id'],
        'provisioned_hours': value['days'] * 8,
        'started_at': Math.floor((new Date(value['started_at'])).getTime() / 1000),
        'client': value['client'],
        'name': value['name'],
        'code': value['code']
      };

      if (project['id'] == null) {
        delete project['id'];

        /* Get user informations */
        this.userInformationsService.onUpdate.first().subscribe((userInformations) => {
          /* Save the project */
          this.dbService.save('projects', project).subscribe((result) => {

            project['id'] = result.inserted_id;

            this.projectCreate.emit({
              'project': project
            });

            /* Add current user as a member */
            this.dbService.save('project_assignements', {
              'project': project,
              'user': {
                'id': userInformations.appUser.id
              },
              'role': {
                'id': 1
              }
            }).subscribe(() => {
              this.locked = false;
            });
          });
        });
      } else {
        const projectId = project['id'];
        this.dbService.update('projects', {
          'id': projectId
        }, project).subscribe((result) => {
          this.projectEdit.emit({
            'project': project
          });
          this.locked = false;
          this.snackBar.open('Project saved.', 'DISMISS', {
            duration: 5000,
          });
        });
      }
    }
  }
}

