import { ViewContainerRef, ChangeDetectorRef, Component, Input, Directive, ViewChild, ComponentFactoryResolver, OnInit, ViewChildren, QueryList, AfterViewInit} from '@angular/core';

@Component({
  selector: 'common-collection',
  templateUrl: 'collection.component.html',
  styleUrls:  ['collection.component.css'],
  providers: [  ]

})
export class CollectionComponent implements AfterViewInit{

    constructor(
      private cd: ChangeDetectorRef,
      private componentFactoryResolver: ComponentFactoryResolver
    ) { }
    
    @Input()
    itemComponent;

    @Input()
    set items(items: Array<object>){
      this._items = items;
      this.refresh();
    }

    private _items: Array<object> = [];screen
    @ViewChildren('componentRef', {read: ViewContainerRef}) public widgetTargets: QueryList<ViewContainerRef>

    public refresh() {
      let component = this.itemComponent;

      if(typeof(this.widgetTargets) !== "undefined"){

        for (let i = 0; i < this.widgetTargets.toArray().length; i++) {
            let target = this.widgetTargets.toArray()[i];
            let widgetComponent = this.componentFactoryResolver.resolveComponentFactory(component);
            
            let cmpRef: any = target.createComponent(widgetComponent);
            cmpRef.instance.value = this._items[i];
            this.cd.detectChanges();
        }
      }
    }

    ngAfterViewInit(): void {
      this.widgetTargets.changes.subscribe(() => {
          this.refresh()
      });
    }
}
