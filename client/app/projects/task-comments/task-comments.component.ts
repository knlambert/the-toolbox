import { Component, OnInit, Input } from '@angular/core';
import { DBService } from './../../db/db.service';
import { Observable, Subject } from 'rxjs';
 
@Component({
  selector: 'hc-task-comments',
  templateUrl: 'task-comments.component.html',
  styleUrls:  [
    'task-comments.component.css'
  ]
})
export class TaskCommentsComponent implements OnInit {

    @Input() taskId: number;
    @Input() comments: Array<object> = [];
    
    private newComment: object = null;

    private userFromCommentLookup = {
      "to": "comment",
      "localField": "author",
      "from": "user",
      "foreignField": "id",
      "as": "author"
    };

    constructor(private dbService: DBService){}

    ngOnInit(){
      /* List all comments for this specific task. */
      this.dbService.list('comments', {
        "task": this.taskId
      }, {
        "created_at": 1
      }, 0, 1000, [this.userFromCommentLookup]).subscribe((comments) => {
        this.comments = comments;
      });

    }

    private onDelete(index: number){
      this.dbService.delete("comments", {
        "id": this.comments[index]['id']
      }).subscribe(() => {
        this.comments.splice(index, 1);
      });
    }

    private displayNewComment(){
      this.newComment = {
        "description": "",
        "task": this.taskId
      };
    }

    private cancelNewComment(){
      this.newComment = null;
    }

    private onSubmitComment(newComment: object){
      newComment['created_at'] = Math.floor(new Date().getTime() / 1000);
      this.dbService.save("comments", newComment).subscribe((id) => {
        newComment['id'] = id;
        this.comments.push(newComment);
        this.newComment = null;
      });
    }
}