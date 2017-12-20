import { Component, Input, Output, EventEmitter} from '@angular/core';
import { Router }   from '@angular/router';

@Component({
  selector: 'ac-filter',
  templateUrl: 'filter.component.html',
  styleUrls:  ['filter.component.css'],
  providers: [ ]
})
export class FilterComponent{

    @Input() fields: Array<Object>;
    @Output() filtersModified = new EventEmitter();
    
    
    private filters: Array<Object> = [];
    private visible: Boolean = false;

    private fieldOperators = {
        "number": [
            {
                "label": "=",
                "value": "$eq"
            },{
                "label": "!=",
                "value": "$ne"
            },{
                "label": "<",
                "value": "$lt"
            },{
                "label": "<=",
                "value": "$lte"
            },{
                "label": ">",
                "value": "$gt"
            },{
                "label": ">=",
                "value": "$gte"
            }
        ],
        "timestamp": [
            {
                "label": "=",
                "value": "$eq"
            },{
                "label": "!=",
                "value": "$ne"
            },{
                "label": "<",
                "value": "$lt"
            },{
                "label": "<=",
                "value": "$lte"
            },{
                "label": ">",
                "value": "$gt"
            },{
                "label": ">=",
                "value": "$gte"
            }
        ],
        "text": [
            {
                "label": "contains",
                "value": "$regex"
            },
            {
                "label": "=",
                "value": "$eq"
            },{
                "label": "!=",
                "value": "$ne"
            }
        ]
    };

    public reset(){
        this.filters = [];
    };

    /**
     * Geneate a correctly formated empty filter.
     */
    private generateEmptyFilter(){
        return {
            "field": "",
            "operator": "",
            "operatorsList": [],
            "value": "",
            "isEditing": true
        };
    };

    /**
     * Get filter operator label.
     * @param value 
     */
    private getFilterOperatorLabel(value){
        let operators = this.fieldOperators['text'].concat(this.fieldOperators['number'].concat(this.fieldOperators['timestamp']));
        for(var i = 0; i < operators.length; i++){
            if(operators[i]['value'] === value){
                return operators[i]['label'];
            }
        }
    };

    /**
     * Check if a given filter is valid.
     * @param filter 
     */
    private isFilterValid(filter: object){
        var valid = !this.isFilterEmpty(filter);

        if(filter['type'] === 'timestamp'){
            valid = valid && !isNaN(new Date(filter['value']).getTime());
        }
            
        valid = valid && (filter['field'] != null && filter['field'] !== "" 
        && filter['operator'] != null && filter['operator'] !== ""
        && filter['value'] != null)   
       
        return valid;
    };

    /**
     * Shortcut to validate a filter.
     * @param index 
     */
    private validateFilter(index){
        if(this.isFilterValid(this.filters[index])){
            this.filters[index]['isEditing'] = false;
            this.filtersModified.emit(this.getFilters());
        }
    };

    /**
     * Set filter flag to editing.
     * @param index 
     */
    private editFilter(index){
        this.filters[index]['isEditing'] = true;
        this.filtersModified.emit(this.getFilters());
    };

    /**
     * Add a new filter.
     */
    public addFilter(){
        this.filters.push(this.generateEmptyFilter());
    };

    /**
     * Remove a filter at index.
     * @param index 
     */
    private removeFilter(index){
        var _this = this;
        if(this.filters.length > 1 || this.isFilterEmpty(this.filters[index])){
            this.filters.splice(index, 1);
            
        }
        else{
            this.filters[0] = this.generateEmptyFilter();
        }
        this.filtersModified.emit(this.getFilters());
    };

    /**
     * Check if the filter is not empty.
     * @param filter 
     */
    private isFilterEmpty(filter){
        return (
            (filter['field'] == null || filter['field'] === "")
            && (filter['operator'] == null || filter['operator'] === "")
            && (filter['value'] == null || filter['value'] === "")
        );
    };

    /**
     * Triggered when a filter is selected.
     * @param fieldName 
     * @param index 
     */
    private onFilterFieldSelected(fieldName, index){
        let fieldDesc = this.getFieldDescription(fieldName);
        let operatorsList = this.getOperators(fieldDesc['type']);
        this.filters[index]['type'] = fieldDesc['type'];
        this.filters[index]['operatorsList'] = operatorsList;
        this.filters[index]['operator'] = operatorsList[0]['value'];
    };

    /**
     * Get operators from type.
     * @param fieldType 
     */
    private getOperators(fieldType){
        return this.fieldOperators[fieldType];
    };

    /**
     * Get filters which are valid in the list.
     */
    private getValidFilters(){
        var output = [];
        for(var i = 0; i < this.filters.length; i++){
            if(!this.filters[i]['isEditing']){
                output.push(this.filters[i])
            }
        }
        return output;
    };

    /**
     * 
     * @param fieldName 
     */
    private getFieldDescription(fieldName){
        for(var i = 0; i < this.fields.length; i++){
            if(fieldName === this.fields[i]['name']){
                return this.fields[i];
            }
        }
    };

    /**
     * Return output state of the filter.
     */
    public getFilters(){
        var filters = JSON.parse(JSON.stringify(this.filters));
        for(var i = 0; i < filters.length; i++){
            if(filters[i]['type'] === 'timestamp'){
                filters[i]['value'] = parseInt(''+new Date(filters[i]['value']).getTime() / 1000);
            }
        }
        let outputFilters = [];
        if(filters != null){
            
            filters.forEach(filter => {
                let outputFilter = {};
                if(this.isFilterValid(filter)){
                    outputFilter[filter['field']] = {};
                    outputFilter[filter['field']][filter['operator']] = filter['value'];
                    outputFilters.push(outputFilter);
                }
            });
        }
    
        if(outputFilters.length === 0){
            return {};
        }

        return {
            $and: outputFilters
        };
    };

}
