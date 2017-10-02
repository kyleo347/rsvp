import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';

@Injectable()
export class UtilsService {

  constructor(private datePipe: DatePipe) { }

  isLoaded(loading: boolean): boolean {
    return loading === false;
  }

  eventDates(start, end): string {
    const startDate = this.datePipe.transform(start, 'mediumDate');
    const endDate = this.datePipe.transform(end, 'mediumDate');

    if (startDate === endDate) {
      return  startDate;
    } else {
      return `${startDate} - ${endDate}`;
    }
  }

  eventDatesTimes(start, end): string {
    const startDate = this.datePipe.transform(start, 'shortDate');
    const startTime = this.datePipe.transform(start, 'shortTime');
    const endDate = this.datePipe.transform(end, 'shortDate');
    const endTime = this.datePipe.transform(end, 'shortTime');

    if (startDate === endDate) {
      return `${startDate}, ${startTime} - ${endTime}`;
    } else {
      return `${startDate}, ${startTime} - ${endDate}, ${endTime}`;
    }
  }

  eventPast(eventEnd): boolean {
    const now = new Date();
    const then = new Date(eventEnd.toString());
    return now >= then;
  }

  tabIs(currentTab: string, tab: string): boolean {
    return currentTab === tab;
  }

  displayCount(guests: number): string {
    // attending this event
    const persons = guests === 1 ? ' person' : ' people';
    return guests + persons;
  }

  showPlusOnes(guests: number): string {
    // if bringing additional guests, show as +n
    if (guests) {
      return `+${guests}`;
    }
  }

  booleanToText(bool: boolean): string {
    return bool ? 'Yes' : 'No';
  }
}
