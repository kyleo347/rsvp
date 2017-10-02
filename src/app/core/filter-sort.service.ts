import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';

@Injectable()
export class FilterSortService {

  constructor(private datePipe: DatePipe) { }

  private _objArrayCheck(array: any[]): boolean {
    // Checks if the first item in the array is an object
    // (assumes same-shape for all array items)
    // Necessary because some arrays passed in may have
    // models that don't match {[key: string]: any}[]
    // This check prevents uncaught reference errors
    const item0 = array[0];
    const check = !!(array.length && item0 !== null && Object.prototype.toString.call(item0) === '[object Object]');
    return check;
  }

  search(array: any[], query: string, excludeProps?: string|string[], dateFormat?: string) {
        // Match query to strings and Date objects / ISO UTC strings
    // Optionally exclude properties from being searched
    // If matching dates, can optionally pass in date format string
    if (!query || !this._objArrayCheck(array)) {
      return array;
    }
    const lQuery = query.toLowerCase();
    const isoDateRegex = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/;
    const dateF = dateFormat ? dateFormat : 'medium';
    const filteredArray = array.filter(item => {
      for (const key in item) {
        if (item.hasOwnProperty(key)) {
          if (!excludeProps || excludeProps.indexOf(key) === -1) {
            const thisVal = item[key];
            if (thisVal) {
              // value is a string and not a UTC date
              if ( typeof thisVal === 'string' && !thisVal.match(isoDateRegex) && thisVal.toLowerCase().indexOf(lQuery) !== -1) {
                return true;
                // value is a date object or a UTC string
              } else if (thisVal instanceof Date || thisVal.toString().match(isoDateRegex) && 
                this.datePipe.transform(thisVal, dateF).toLowerCase().indexOf(lQuery) !== -1) {
                  return true;
              }
            }
          }
        }
      }
    });
    return filteredArray;
  }

  noSearchResults(arr: any[], query: string): boolean {
    return !!(!arr.length && query);
  }

  orderByDate(array: any[], prop: string, reverse?: boolean) {
    if (!prop || !this._objArrayCheck(array)) {
      return array;
    }
    const sortedArray = array.sort((a,b) => {
      const dateA = new Date(a[prop]).getTime();
      const dateB = new Date(b[prop]).getTime();
      return !reverse ? dateA - dateB : dateB - dateA;
    });
    return sortedArray;
  }

  filter(array: any[], property: string, value: any) {
    // return only items with a specific key/value pair
    if (!property || value === undefined || !this._objArrayCheck(array)) {
      return array;
    }
    const filteredArray = array.filter(item => {
      for (const key in item) {
        if (item.hasOwnProperty(key)){
          if (key === property && item[key] === value) {
            return true;
          }
        }
      }
    });
    return filteredArray;
  }

}
