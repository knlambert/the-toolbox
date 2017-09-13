import { ViewContainerRef, Component, Input, Directive, ViewChild, ComponentFactoryResolver, OnInit, ViewChildren, QueryList, AfterViewInit} from '@angular/core';
// import { CollectionItemDynamicDirective } from './../collection-item-dynamic/collection-item-dynamic.directive';
import { LoaderComponent } from './../loader/loader.component';

@Component({
  selector: 'common-collection',
  templateUrl: 'collection.component.html',
  styleUrls:  ['collection.component.css'],
  providers: [  ]

})
export class CollectionComponent implements AfterViewInit{

    constructor(private componentFactoryResolver: ComponentFactoryResolver) { }
    
    @Input()
    set items(items: Array<object>){
      this._items = items;
      this.refresh();
    }

    private _items: Array<object> = [];screen
    @ViewChildren('componentRef', {read: ViewContainerRef}) public widgetTargets: QueryList<ViewContainerRef>

    public refresh() {
      let component = LoaderComponent;

      if(typeof(this.widgetTargets) !== "undefined"){

        for (let i = 0; i < this.widgetTargets.toArray().length; i++) {
            let target = this.widgetTargets.toArray()[i];
            let widgetComponent = this.componentFactoryResolver.resolveComponentFactory(component);
            let cmpRef: any = target.createComponent(widgetComponent);

          
        }
      }
    }

    ngAfterViewInit(): void {
      this.widgetTargets.changes.subscribe(() => {
        this.refresh()
      });
    }
}
