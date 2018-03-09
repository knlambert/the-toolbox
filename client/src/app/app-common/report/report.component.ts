import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { FilterComponent } from './../../app-common/filter/filter.component';
@Component({
  selector: 'report',
  templateUrl: 'report.component.html',
  styleUrls: ['report.component.css'],
  providers: []
})
export class ReportComponent implements OnInit {

  constructor(public snackBar: MatSnackBar) { }

  ngOnInit() {
    var that = this;
  };

  @Input() items: Array<object> = [];
  @Input() fields: Array<object> = [];
  @ViewChild('reportFilter') reportFilter: FilterComponent;
  @Output() refreshed = new EventEmitter();
  @Output() deleted = new EventEmitter();
  @Output() edited = new EventEmitter();
  @Output() added = new EventEmitter();
  @Output() exported = new EventEmitter();

  public isLoading: boolean = false;
  public page: number = 0;
  public pageSize: number = 10;
  private index: number = 0;
  public hasSelection: boolean = false;
  private orderBy = {};

  /**
   * This method set the report in a loading state. 
   * (A loading bar appears).
   * @param state 
   */
  public setLoading(state: boolean = true) {
    if (this.isLoading != state) {
      this.isLoading = state;
    }
  };

  /**
   * Get an item of the report from his UUID.
   * @param uuid 
   */
  private getFromUUID(uuid: any): object {
    for (var i = 0; i < this.items.length; i++) {
      if (this.items[i]['uuid'] === uuid) {
        return this.items[i];
      }
    }
    return null;
  };

  /**
   * Increments pager
   */
  public pageNext() {
    this.page += this.pageSize;
    this.refresh();
  }

  /**
   * Decrement pager
   */
  public pageBefore() {
    if (this.page > 0) {
      this.page -= this.pageSize;
      this.refresh();
    }
  }

  /**
   * Select or unselect all the lines.
   * @param event The event from the checkbox.
   */
  public selectAllLines(event) {
    for (let i = 0; i < this.items.length; i++) {
      this.items[i]['isSelected'] = event.checked;
    }
    this.hasSelection = this.getSelectedUuids().length > 0;
  }


  private selectLine(uuid: any) {
    for (let i = 0; i < this.items.length; i++) {
      if (this.items[i]['uuid'] === uuid) {
        this.items[i]['isSelected'] = !this.items[i]['isSelected'];
        break;
      }
    }
    this.hasSelection = this.getSelectedUuids().length > 0;
  }

  /**
   * Set the items of the Array.
   * @param items 
   */
  public setItems(items: Array<object>) {
    this.items = [];
    items.forEach((item) => {
      this.items.push({
        uuid: this.index++,
        isSelected: false,
        object: item,
        isCreated: true
      });
    });
    this.setLoading(false);
  }

  /**
   * Start download
   */
  public export() {
    this.exported.emit({
      page: this.page,
      pageSize: this.pageSize,
      orderBy: this.orderBy,
      filters: this.reportFilter.getFilters()
    });
  };

  /**
   * Refresh the report.
   */
  public refresh(reset: boolean = false) {
    if (reset) {
      this.reset();
    }
    this.hasSelection = false;
    this.setLoading(true);
    this.refreshed.emit({
      page: this.page,
      pageSize: this.pageSize,
      orderBy: this.orderBy,
      filters: this.reportFilter.getFilters()
    });
  };

  /**
   * Reset the parameters of the report.
   */
  public reset() {
    this.reportFilter.reset();
    this.page = 0;
    this.orderBy = {};
  }

  /**
   * Get technical uuids
   */
  private getSelectedUuids() {
    var selectedUuids = [];
    this.items.forEach((item) => {
      if (item['isSelected']) {
        selectedUuids.push(item['uuid']);
      }
    });
    return selectedUuids;
  };

  /**
   * Get selected items.
   */
  private getSelectedObjects() {
    const selectedObjects = [];
    this.items.forEach((item) => {
      if (item['isSelected']) {
        selectedObjects.push(item);
      }
    });
    return selectedObjects;
  }

  /**
   * Delete the selection.
   */
  public delete() {
    this.setLoading(true);
    this.deleted.emit({
      selectedObjects: this.getSelectedObjects()
    });
  }

  /**
   * Edit the selection.
   */
  public edit() {
    this.edited.emit({
      selectedObjects: this.getSelectedObjects()
    });
  }

  public add() {
    this.added.emit({
      uuid: this.index++,
      object: {},
      isCreated: false
    });
  }

  /**
   * Set the fields to display in the array
   * @param fields The field to set.
   */
  public setFields(fields: Array<object>) {
    this.fields = fields;
  }

  /**
   * Format the header of the array.
   * @param header The header to format.
   */
  public formatHeader(header: string) {
    const ret = header.charAt(0).toUpperCase() + header.slice(1);
    return ret.replace('_', ' ').replace('.', ' ');
  }

  /**
   * Recursive method to get path to an item in a object.
   * @param obj The object we fetch.
   * @param path The path to the object.
   * @param parent The parent one.
   */
  private getItem(obj: object, path: string, parent?: string) {
    if (obj == null) {
      return '';
    }
    const tab = path.split('.');
    if (tab.length === 1) {
      return obj[tab[0]];
    } else if (tab.length > 1) {
      parent = tab.splice(0, 1)[0];
      return this.getItem(obj[parent], tab.join('.'));
    }
  }

  /**
   * Format the cell, regarding his type.
   * @param object The object to format.
   * @param field The field definition.
   */
  private formatCell(item: object, field: object) {
    const cell = this.getItem(item, field['name']);
    if (field['type'] === 'number') {
      return parseFloat(cell);
    } else if (field['type'] === 'datetime' || field['type'] === "date" ) {
      const date = new Date(parseInt(cell, 0) * 1000);
      if (date) {
        const day = (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear();
        const hour = ('0' + date.getHours()).slice(-2) + ':' +
          ('0' + date.getMinutes()).slice(-2) + ':' + ('0' + date.getSeconds()).slice(-2);
        return day + ' ' + hour;
      } else {
        return '';
      }
    }
    return cell;
  }

  /**
   * Send a signal to edit the line.
   * @param obj The item to edit.
   */
  private editLine(item: Object) {
    this.edited.emit({
      selectedObjects: item
    });
  }

  /**
   * Called from template when sorting.
   * @param field The field to sort.
   */
  private sort(field: object) {
    const sorting = this.getFieldSorting(field);
    if (sorting == null) {
      this.orderBy[field['name']] = 1;
    } else {
      this.orderBy[field['name']] = -sorting;
    }
    this.refresh();
  }

  /**
   * Return the sorting of the field. Null if nothing.
   * @param field TThe field we want to get the current sorting.
   */
  private getFieldSorting(field: object) {
    return this.orderBy[field['name']];
  }
}
