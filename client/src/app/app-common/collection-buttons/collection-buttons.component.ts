import { Output, EventEmitter, Component, Input, Directive } from '@angular/core';

@Component({
  selector: 'common-collection-buttons',
  templateUrl: 'collection-buttons.component.html',
  styleUrls: ['collection-buttons.component.css'],
  providers: []

})
export class CollectionButtonsComponent {
  @Input() hideRemoveButton: boolean = false;
  @Output() onClickAdd = new EventEmitter();
  @Output() onClickRemove = new EventEmitter();
}
