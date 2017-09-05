import { Component, Input } from '@angular/core';
@Component({
  selector: 'common-collection',
  templateUrl: 'collection.component.html',
  styleUrls:  ['collection.component.css'],
  providers: [  ]

})
export class CollectionComponent {

    @Input() items: Array<object> = [];

}
