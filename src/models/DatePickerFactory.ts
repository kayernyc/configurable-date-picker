/*
  Data model for dates
  Supplies date objects for view
*/

/*
  Month is Jan, Feb, etc  
  Date is a series of days
  Day is Monday, Tuesday, etc
  Year is 1999, 2000, etc
  Week is 7 days back from current date
  Hour is Hour + AM/PM
  Hour24 is military time
  Calendar is year/month/date
*/

import DateType from "../enums/DateType";
import ViewConfiguration from "../enums/ViewConfiguration";
import DateTimeFormat from "../enums/DateTimeFormat";
import AtomicDateObject from "./AtomicDateObject";

export default class DatePickerFactory {
  private dateType: DateType;
  private maxDate?: Date;
  private minDate?: Date;
  private dateTimeFormat: DateTimeFormat;

  constructor(config: ViewConfiguration) {
    const { dateType, maxDate, minDate } = config;
    this.dateType = dateType;
    this.maxDate = maxDate;
    this.minDate = minDate;

    this.dateTimeFormat = this.setFormats()
  }

  private setFormats = (dateType: DateType = this.dateType): DateTimeFormat => {
    switch(dateType) {
      case DateType.MONTH: 
        return { month: 'long' }
      case DateType.DATE: 
        return {day: 'numeric', month: 'long', year: 'numeric'}
      case DateType.DAY:
        return { weekday: 'long'}
      case DateType.YEAR:
        return { year: 'numeric' }
      case DateType.WEEK:
        return { weekday: 'long', day: 'numeric', month: 'long'}
      case DateType.HOUR, DateType.HOUR24:
        return { hour: '2-digit'}
      default: // Calendar
        return {day: 'numeric', month: 'numeric', year: 'numeric'}
    }
  }

  private sequence(quantity: number = 1): AtomicDateObject[] {
    
    let arr = [];

    for (let i: number = 0; i < quantity; i++) {
      const date = new Date();
      date.setDate(1);
      date.setMonth(i);

      const atomicDate = new AtomicDateObject(date, undefined, this.dateTimeFormat)

      arr.push(atomicDate);
    }
    return []
  }

  // API
  dateArray(quantity: number = 1): AtomicDateObject[] {
    switch (this.dateType) {
      case DateType.DATE:
        console.log(`I am date`);
        break;
      case (DateType.DAY, DateType.WEEK):
        console.log(`I am day or week`);
        break;
      case DateType.HOUR:
        console.log(`I am hour`);
        break;
      case DateType.MONTH:
        let requestedQuantity = Math.min(12, quantity)
        const monthSeriesFunction = (index: number) => {
          const date = new Date();
          date.setDate(1);
          date.setMonth(index);

          const atomicDate = new AtomicDateObject(date, undefined, this.dateTimeFormat)
        }

        return this.sequence(requestedQuantity);

      case DateType.YEAR:
        console.log("I am YEAR");
      default:
        console.log("I am Calendar", this.dateType);
    }
    
    return [new AtomicDateObject(new Date(), undefined, this.dateTimeFormat)];
  }
}
