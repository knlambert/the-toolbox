import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { GoogleColorsService } from './../../app-common/google-colors.service';

@Component({
  selector: 'hc-project-list-item',
  templateUrl: 'project-list-item.component.html',
  styleUrls: [
    'project-list-item.component.css'
  ]
})
export class ProjectListItemComponent {

  constructor(private router: Router, private googleColorsService: GoogleColorsService) { }
  @Input()
  value: object;

  public openProject() {
    this.router.navigate(['/projects/' + this.value['id'] + '/dashboard']);
  }

  /**
   * Get a color for the project.
   * @param item The project we want the color.
   */
  public getProjectColor(item: object) {
    return this.googleColorsService.generate(item['name'], '600');
  }

}
