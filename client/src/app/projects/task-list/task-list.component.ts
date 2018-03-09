import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { DBService } from './../../db/db.service';
import { UserInformationsService } from './../../auth/user-informations.service';
import { UserInformations } from './../../auth/user-informations.model';

import { Observable, Subject } from 'rxjs';
import { TaskDetailsComponent } from './../task-details/task-details.component';

@Component({
  selector: 'hc-task-list',
  templateUrl: 'task-list.component.html',
  styleUrls: [
    'task-list.component.css'
  ]
})
export class TaskListComponent implements OnInit {

  constructor(
    private dbService: DBService,
    private router: Router,
    private userInformationsService: UserInformationsService
  ) { }

  @Input() taskList: object;
  @Input() set uncompletedTasksOnly(uncompletedTasksOnly: boolean) {
    this._uncompletedTasksOnly = uncompletedTasksOnly;
    this.refreshTasks();
  }
  @Input() set selectedMembers(selectedMembers: Array<object>) {
    this._selectedMembers = selectedMembers;
    this.refreshTasks();
  }
  @Output() delete = new EventEmitter();
  @Output() taskOpen = new EventEmitter();

  public tasksSumUp: Array<object> = [];
  private _uncompletedTasksOnly = false;
  private _selectedMembers: Array<object> = [];
  private userInformations: UserInformations;
  public loading = true;

  ngOnInit() {
    this.userInformationsService.onUpdate.subscribe((userInformations: UserInformations) => {
      this.userInformations = userInformations;
    });
  }

  private refreshTasks() {
    this.loading = true;

    const filters = {
      'task_list': this.taskList['id']
    };

    if (this._uncompletedTasksOnly) {
      filters['completed'] = false;
    }

    let selectedMembersAffectedTasks = Observable.of(null);
    if (this._selectedMembers.length > 0) {
      selectedMembersAffectedTasks = this.dbService.list('task-assignements', {
        'task.task_list.id': this.taskList['id'],
        '$or': this._selectedMembers.map((user) => {
          return {
            'user.id': user['id']
          };
        })
      }).map((items) => {
        return items.map((item) => {
          return { 'id': item['task']['id'] };
        });
      });
    }


    selectedMembersAffectedTasks.flatMap((taskIdsFilters) => {
      if (taskIdsFilters != null) {
        if (taskIdsFilters.length === 0) {
          taskIdsFilters = [{
            'id': -1
          }];
        }
        filters['$or'] = taskIdsFilters;
      }
      return Observable.of(filters);
    }).flatMap((newfilters) => this.dbService.list('tasks-sum-up', newfilters)).subscribe((items) => {
      this.tasksSumUp = [];
      items.forEach((value) => {
        this.insertItem(value, 'saved');
      });
      this.loading = false;
    });

  }

  openTask(taskId: object): void {
    this.dbService.get('tasks', taskId).subscribe((task) => {
      this.taskOpen.emit({
        'task': task
      });
    });
  }

  public insertItem(value?: object, status?: string) {
    value = value || {
      'task_list': {
        'id': this.taskList['id']
      },
      'title': '',
      'completed': 0,
      'created_at': Math.floor((new Date()).getTime() / 1000),
      'author': {
        "id": this.userInformations.appUser.id
      }
    };

    status = status || 'new';

    if (status === 'new') {
      this.dbService.save('tasks', value).subscribe((saved) => {
        value['id'] = saved['inserted_id'];
        this.tasksSumUp.push({
          'status': 'saved',
          'value': value
        });
      });
    } else {
      this.tasksSumUp.push({
        'status': 'saved',
        'value': value
      });
    }
  }



  public onTitleChange() {
    this.dbService.update('task-lists', {
      'id': this.taskList['id']
    }, {
        'title': this.taskList['title']
      }).subscribe((result) => {

      });
  }

  private getTaskIndexById(id: string) {
    for (let i = 0; i < this.tasksSumUp.length; i++) {
      if (this.tasksSumUp[i]['value']['id'] === id) {
        return i;
      }
    }
    return -1;
  }

  private deleteTaskFromId(taskId: number) {
    for (let i = 0; i < this.tasksSumUp.length; i++) {
      if (this.tasksSumUp[i]['id'] === taskId) {
        this.tasksSumUp.splice(i, 1);
        break;
      }
    }
  }

  private deleteTask(taskId: number) {

    this.dbService.delete('tasks', {
      'id': taskId
    }).subscribe(() => {
      const position = this.fetchItemPosition(taskId);
      this.tasksSumUp.splice(position, 1);
      this.deleteTaskFromId(taskId);
    });
  }

  private updateTaskTile(taskId) {
    this.dbService.get('tasks-sum-up', taskId).subscribe((taskSumUp) => {
      this.updateValue(taskId, taskSumUp);
    });
  }

  private fetchItemPosition(taskId: number) {
    for (var i = 0; i < this.tasksSumUp.length; i++) {
      if (this.tasksSumUp[i]['value']['id'] === taskId) {
        return i;
      }
    }
  }

  private updateValue(taskId: number, value: object) {
    const position = this.fetchItemPosition(taskId);
    this.tasksSumUp[position]['value'] = value;
  }

  public updateTaskItem(id: string) {
    this.dbService.get('tasks-sum-up', id).subscribe((task) => {
      const index = this.getTaskIndexById(id);
      this.tasksSumUp[index]['value'] = task;
    });
  }

  public completeTaskList(completed: boolean) {
    this.dbService.update('task-lists', {
      'id': this.taskList['id']
    }, {
        'completed': completed
      }).subscribe((result) => { });
  }
}
