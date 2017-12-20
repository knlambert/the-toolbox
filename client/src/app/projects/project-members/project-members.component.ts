import { Component, OnInit, Input } from '@angular/core';
import { DBService } from './../../db/db.service';
import { Observable, Subject } from 'rxjs';

@Component({
  selector: 'hc-project-members',
  templateUrl: 'project-members.component.html',
  styleUrls: [
    'project-members.component.css'
  ]
})
export class ProjectMembersComponent implements OnInit {

  @Input() projectId: number;
  constructor(private dbService: DBService) { }

  public assignements: Array<object> = [];
  public new = false;

  private displayNewForm(display: boolean = true) {
    this.new = display;
  }

  ngOnInit() {
    this.refreshMembers();
  }

  private refreshMembers() {
    this.dbService.list('project_assignements', {
      'project.id': this.projectId
    }).subscribe((assignements) => {
      this.assignements = assignements;
    });
  }

  private memberCreated() {
    this.new = false;
    this.refreshMembers();
  }

  private memberCanceled() {
    this.new = false;
  }

  private deleteMember(assignementId: number) {
    this.dbService.delete('project_assignements', {
      'id': assignementId
    }).subscribe((result) => {
      this.refreshMembers();
    });

    this.refreshMembers();
  }
}
