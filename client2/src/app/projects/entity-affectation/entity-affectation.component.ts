import { Component, Input, OnInit, Inject, Output, EventEmitter } from '@angular/core';
import { Location } from '@angular/common';
import { DBService } from './../../db/db.service';
import { Observable, Subject, ReplaySubject } from 'rxjs';

@Component({
  selector: 'hc-entity-affectation',
  templateUrl: 'entity-affectation.component.html',
  styleUrls:  [
    'entity-affectation.component.css'
  ]
})
export class EntityAffectationComponent implements OnInit {

    @Input() title: string;
    @Input() placeholder: string = "Select an affectation";
    @Input() availableEntities: Array<object>;
    @Input() locked: boolean;
    @Input() primaryKey: string = "id";
    @Input() labelKey: string = "name";
    @Input() colorField: string = null;

    @Input() set savedAffectedEntities(entities){
        this._savedAffectedEntities = entities;
        this._availableEntities = this.availableEntities;
        entities.forEach(entity => {
            this.addEntityAffectation(entity[this.primaryKey]);
        });
    }
    
    private _availableEntities: Array<object> = [];
    private _affectedEntities: Array<object> = [];
    private _savedAffectedEntities: Array<object> = [];

    ngOnInit(){ }

    private findIndexByKey(tab: Array<object>, key: string){
        for(var i = 0; i < tab.length; i++){
            if(tab[i][this.primaryKey] === key){
                return i;
            }
        }
        return -1;
    }

    private deleteEntityAffectation(key: string){
        let index = this.findIndexByKey(this._affectedEntities, key);
        this._availableEntities.push(this._affectedEntities[index]);
        this._affectedEntities.splice(index, 1);
    };

    private addEntityAffectation(key: string){
        let index = this.findIndexByKey(this._availableEntities, key);
        if(index !== -1){
            this._affectedEntities.push(this._availableEntities[index]);
            this._availableEntities.splice(index, 1);
        }
    };

    /**
     * Copy items in affected into saved. Then changes will be reset.
     */
    public commitChanges(){
        let temp = JSON.parse(JSON.stringify(this._affectedEntities));
        this._affectedEntities = this._affectedEntities;
        this.savedAffectedEntities = temp;
    }
    public getChanges(reset: boolean = false){
        
        let affectedEntitiesKeys = this._affectedEntities.map((entity) => entity[this.primaryKey]);
        let savedEntitiesKeys = this._savedAffectedEntities.map((entity) => entity[this.primaryKey]);
        let result = {
            "toAdd": this._affectedEntities.filter((toSaveEntity) => savedEntitiesKeys.indexOf(toSaveEntity[this.primaryKey]) === -1),
            "toRemove": this._savedAffectedEntities.filter((toSaveEntity) => affectedEntitiesKeys.indexOf(toSaveEntity[this.primaryKey]) === -1)
        };
        if(reset){
            /* Remove / add items which will change */
            result["toAdd"].forEach((entity) => {
                this._savedAffectedEntities.push(entity);
            });
            result["toRemove"].forEach((entity) => {
                let index = this.findIndexByKey(this._savedAffectedEntities, entity[this.primaryKey]);
                this._savedAffectedEntities.splice(index, 1);
            });
        }
        return result;
    }

    private getEntityColor(entity: object){
        if(typeof(entity) !== "undefined"){
            return entity['color'] || '#3F51B5'
        }
        return '#3F51B5';
        
    }
}