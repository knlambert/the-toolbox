import { Component, OnInit, Input, ViewChildren, QueryList } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { TaskListComponent } from './../task-list/task-list.component';
import { Observable, Subject } from 'rxjs';
import { DBService } from './../../db/db.service';
import { UserInformationsService } from './../../auth/user-informations.service';

@Component({
  selector: 'hc-task-menu',
  templateUrl: 'task-menu.component.html',
  styleUrls: [
    'task-menu.component.css'
  ]
})
export class TaskMenuComponent implements OnInit {

  constructor(
    private location: Location,
    private dbService: DBService,
    private userInformationsService: UserInformationsService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  @Input() projectId: number;
  @Input() projectMembers: Array<object>;
  @ViewChildren('taskListComponent') taskListComponents: QueryList<TaskListComponent>;

  public taskLists: Array<object> = [];
  public openedTask: object = null;
  public uncompletedTasksOnly: boolean;
  private selectedMembers: Array<object> = [];


  ngOnInit() {
    this.refreshTaskLists(true, []);
  }

  public refreshTaskLists(uncompletedTasksOnly: boolean, selectedMembers: any) {

    const filters = {
      'project.id': this.projectId
    };
    if (uncompletedTasksOnly) {
      filters['completed'] = false;
    }

    this.taskLists = [];
    this.selectedMembers = selectedMembers || [];
    this.uncompletedTasksOnly = uncompletedTasksOnly;

    this.dbService.list('task-lists', filters).subscribe((items) => {
      this.taskLists = [];
      items.forEach((value) => {
        this.insertItem(value, 'saved');
      });
      this.route.paramMap.subscribe((params: ParamMap) => {
        const taskId = parseInt(params.get('taskId'), 0);
        if (!isNaN(taskId)) {
          this.dbService.get('tasks', taskId).subscribe((task) => {
            this.openedTask = task;
          });
        }
      });
    });
  }

  public insertItem(value?: object, status?: string) {
    value = value || {
      'project': {
        'id': this.projectId
      },
      'title': '',
      'completed': 0,
      'end_date': Math.floor(new Date().getTime() / 1000)
    };

    status = status || 'new';

    if (status === 'new') {
      this.dbService.save('task-lists', value).subscribe((saved) => {
        value['id'] = saved['inserted_id'];
        this.taskLists.push({
          'status': 'saved',
          'value': value
        });
      });
    } else {
      this.taskLists.push({
        'status': 'saved',
        'value': value
      });
    }
  }

  private fetchItemPosition(taskListId: number) {
    for (let i = 0; i < this.taskLists.length; i++) {
      if (this.taskLists[i]['value']['id'] === taskListId) {
        return i;
      }
    }
  }

  private deleteTaskList(taskListId: number) {
    const position = this.fetchItemPosition(taskListId);
    this.dbService.delete('task-lists', {
      'id': taskListId
    }).subscribe((result) => {
      this.taskLists.splice(position, 1);
    });
  }

  /**
   * Open a specific task.
   * @param task 
   */
  private openTask(task: object) {
    this.openedTask = task;
  }

  /**
   * Close the opened task.
   * @param task The task to open.
   */
  private closeTask(task: object) {
    this.openedTask = null;
    const taskMenuUrl = 'projects/' + this.projectId + '/tasks';
    this.location.go(taskMenuUrl);
    this.router.navigate([taskMenuUrl]);
    this.taskListComponents.forEach((component: TaskListComponent) => {
      if (component.taskList['id'] === task['task_list']['id']) {
        component.updateTaskItem(task['id']);
      }
    });
  }

  /**
   * Update title & description for the task. Triggered by task detail component.
   * @param taskId The ID of the task to update.
   * @param title The title to update.
   * @param description The description to update.
   * @param affectedUsersChange: Two fields with to add & to remove users.
   * @param affectedTagsChange: Two field with to add & to remove tags.
   */
  private updateTaskTitleDescription(
    taskId: number,
    title: string,
    description: string,
    affectedUsersChanges: object,
    affectedTagsChanges: object
  ) {

    this.dbService.update('tasks', {
      'id': taskId
    }, {
        'title': title,
        'description': description
      }).subscribe(() => {

        affectedUsersChanges['toAdd'].forEach((user) => {
          this.dbService.save('task-assignements', {
            'task': {
              'id': taskId
            },
            'user': user
          }).subscribe();
        });

        affectedUsersChanges['toRemove'].forEach((user) => {
          this.dbService.delete('task-assignements', {
            'task.id': taskId,
            'user.id': user['id']
          }).subscribe();
        });

        affectedTagsChanges['toAdd'].forEach((tag) => {
          this.dbService.save('task-tags', {
            'task': {
              'id': taskId
            },
            'tag': tag
          }).subscribe();
        });

        affectedTagsChanges['toRemove'].forEach((tag) => {
          this.dbService.delete('task-tags', {
            'task.id': taskId,
            'tag.id': tag['id']
          }).subscribe();
        });

      });
  }
}
