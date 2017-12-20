import { Component, Input, OnInit, Inject, Output, EventEmitter, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { DBService } from './../../db/db.service';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Subject } from 'rxjs/Subject';
import { EntityAffectationComponent } from '../entity-affectation/entity-affectation.component';

@Component({
  selector: 'hc-task-details',
  templateUrl: 'task-details.component.html',
  styleUrls: [
    'task-details.component.css'
  ]
})
export class TaskDetailsComponent implements OnInit {


  constructor(
    private location: Location,
    private dbService: DBService
  ) { }

  @Input() task: object;
  @Output() taskSubmit = new EventEmitter();
  @Output() taskPrevious = new EventEmitter();
  @Output() taskTitleDescriptionUpdate = new EventEmitter();

  @ViewChild('affectedUsersComponent') affectedUsersComponent: EntityAffectationComponent;
  @ViewChild('affectedTagsComponent') affectedTagsComponent: EntityAffectationComponent;


  public affectedUsers: Array<object> = [];
  public affectedTags: Array<object> = [];
  public availableUsers: Array<object> = [];
  public availableTags: Array<object> = [];
  public locked = true;

  ngOnInit() {
    this.location.go('projects/' + this.task['task_list']['project']['id'] + '/tasks/' + this.task['id']);
    if (this.task['title'] === '') {
      this.locked = false;
    }

    this.refreshAvailableMembers().subscribe((availableUsers) => {
      this.availableUsers = availableUsers;
      this.refreshAffectedUser().subscribe((affectedUsers) => {
        this.affectedUsers = affectedUsers.map((item) => {
          return item['user'];
        });
      });
    });

    this.refreshAvailableTags().subscribe((availableTags) => {
      this.availableTags = availableTags;
      this.refreshAffectedTags().subscribe((affectedTags) => {
        this.affectedTags = affectedTags.map((item) => {
          return item['tag'];
        });
      });
    });
  }

  onNoClick(): void { }

  private refreshAvailableTags() {
    return this.dbService.list('tags');
  }

  private refreshAffectedTags() {
    return this.dbService.list('task-tags', {
      'task.id': this.task['id']
    });
  }

  private refreshAvailableMembers() {
    return this.dbService.list('project_assignements', {
      'project.id': this.task['task_list']['project']['id']
    }, { 'user.name': 1, 'user.id': -1 }).map((items) => {
      return items.map((item) => {
        return item['user'];
      });
    });
  }

  private refreshAffectedUser() {
    return this.dbService.list('task-assignements', {
      'task.id': this.task['id']
    });
  }

  public updateField(key: string, value: any) {
    const update = {};
    update[key] = value;
    this.dbService.update_id('tasks', this.task['id'], update).subscribe(() => { });
  }

  public doPrevious() {
    this.taskPrevious.emit({
      'task': this.task
    });
  }

  public doUnlock() {
    this.locked = false;
  }

  public doSave() {
    this.locked = true;
    this.taskTitleDescriptionUpdate.emit({
      'taskId': this.task['id'],
      'title': this.task['title'],
      'description': this.task['description'],
      'affectedUsersChanges': this.affectedUsersComponent.getChanges(true),
      'affectedTagsChanges': this.affectedTagsComponent.getChanges(true)
    });
  }
}
