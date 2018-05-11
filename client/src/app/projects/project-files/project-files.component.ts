import { Component, OnInit, Input } from '@angular/core';
import { DBService } from './../../db/db.service';
import { Observable ,  Subject } from 'rxjs';
 
@Component({
  selector: 'hc-project-files',
  templateUrl: 'project-files.component.html',
  styleUrls: [
    'project-files.component.css'
  ]
})
export class ProjectFilesComponent implements OnInit {

  @Input() projectId: number;
  constructor(private dbService: DBService) { }

  private files: Array<object> = [];
  public new = false;

  public displayNewForm(display: boolean = true) {
    this.new = display;
  }

  ngOnInit() {
    this.refreshFiles();
  }

  public refreshFiles() {
    this.dbService.list('project_files', {
      'project.id': this.projectId
    }).subscribe((files) => {
      this.files = files;
    });
  }

  private openLink(url: string) {
    window.open(url, '_blank');
  }

  private fileCreated() {
    this.new = false;
    this.refreshFiles();
  }

  private fileCanceled() {
    this.new = false;
  }

  private deleteFile(fileId: number) {
    this.dbService.delete('project_files', {
      'id': fileId
    }).subscribe((result) => {
      this.refreshFiles();
    });

    this.refreshFiles();
  }
}
