import { Output, EventEmitter, ViewContainerRef, ChangeDetectorRef, Component, Input, Directive, ViewChild, ComponentFactoryResolver, OnInit, ViewChildren, QueryList, AfterViewInit} from '@angular/core';

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
      let techItems = [];
      items.forEach((item) => {
        techItems.push({
          "value": item,
          "isSelected": false
        });
      });
      this._items = techItems;
      this.refresh();
    }
    @Output() onItemOpened = new EventEmitter();

    private selectedItemIndexes: Array<number> = [];
    private _items: Array<object> = [];screen
    @ViewChildren('componentRef', {read: ViewContainerRef}) public widgetTargets: QueryList<ViewContainerRef>

    public refresh() {
      let selectedItems = [];
      let component = this.itemComponent;
      
      if(typeof(this.widgetTargets) !== "undefined" && this._items.length > 0){
        
        for (let i = 0; i < this.widgetTargets.toArray().length; i++) {
            let target = this.widgetTargets.toArray()[i];
            let widgetComponent = this.componentFactoryResolver.resolveComponentFactory(component);
            target.clear();
            let cmpRef: any = target.createComponent(widgetComponent);
            cmpRef.instance.value = this._items[i]["value"];
            this.cd.detectChanges();
        }
      }
    }

    ngAfterViewInit(): void {
      this.widgetTargets.changes.subscribe(() => {
          this.refresh()
      });
    }

    /**
     * Select an item from his position in the list.
     * @param index The index of the item we want to select.
     */
    private selectItem(index: number){
      this._items[index]['isSelected'] = !this._items[index]['isSelected'];
    }
}
