import { Directive, Input, ViewContainerRef} from '@angular/core';

@Directive({
  selector: '[common-collection-item-dynamic]',
  providers: [  ]

})
export class CollectionItemDynamicDirective {
    constructor(public viewContainerRef: ViewContainerRef) {}
}
