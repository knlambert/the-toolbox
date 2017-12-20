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
  selector: 'hc-project-file-form',
  templateUrl: 'project-file-form.component.html',
  styleUrls: [
    'project-file-form.component.css'
  ]
})
export class ProjectFileFormComponent implements OnInit {

  constructor(
    private dbService: DBService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) { }

  @Input() projectId: number;
  public form: FormGroup;
  public locked = false;

  @Output() fileCreate = new EventEmitter();
  @Output() cancel = new EventEmitter();

  ngOnInit() {
    this.form = this.fb.group({
      'name': [null, Validators.compose([Validators.required])],
      'url': [null, Validators.compose([Validators.required])]
    });
  }
  public submitForm(value: object) {
    if (this.form.valid) {
      this.locked = true;
      value['project'] = {
        'id': this.projectId
      };
      this.dbService.save('project_files', value).subscribe((result) => {
        value['id'] = result['inserted_id'];
        this.fileCreate.emit({
          'file': value
        });
      }, (error) => {
        this.snackBar.open('File already registered.', 'DISMISS', {
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
