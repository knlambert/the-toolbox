import { Component, Input, Directive, ViewChild, ComponentFactoryResolver, OnInit, ViewChildren, QueryList} from '@angular/core';
import { CollectionItemDynamicDirective } from './../collection-item-dynamic/collection-item-dynamic.directive';
import { LoaderComponent } from './../loader/loader.component';

@Component({
  selector: 'common-collection',
  templateUrl: 'collection.component.html',
  styleUrls:  ['collection.component.css'],
  providers: [  ]

})
export class CollectionComponent {

    constructor(private componentFactoryResolver: ComponentFactoryResolver) { }
    
    @Input()
    set items(items: Array<object>){
      this._items = items;
      this.refresh();
  
    }

    private _items: Array<object> = [];screen
    @ViewChildren(CollectionItemDynamicDirective) components: QueryList<CollectionItemDynamicDirective>

    public refresh() {
      let componentFactory = this.componentFactoryResolver.resolveComponentFactory(LoaderComponent);
      if(typeof(this.components) !== "undefined"){
        this.components.forEach((component, index) => {
            var dynamicComponentRef = component.viewContainerRef;
            dynamicComponentRef.clear();
            let componentRef = dynamicComponentRef.createComponent(componentFactory);
            this.components.
        });
      }
          
      // 
      // 
      // dynamicComponentRef.clear();
      // let componentRef = dynamicComponentRef.createComponent(componentFactory);
    }

}
