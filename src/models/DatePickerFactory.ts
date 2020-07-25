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

type AtomicDateObjectCreator = (index: number) => AtomicDateObject;

export default class DatePickerFactory {
  private dateType: DateType;
  private maxDate?: Date;
  private minDate?: Date;
  private dateTimeFormat: DateTimeFormat;
  private atomicDateObjectFunction: AtomicDateObjectCreator;

  private configurationMap: Map<DateType, any> = new Map();

  constructor(config: ViewConfiguration) {
    const { dateType, maxDate, minDate } = config;
    this.dateType = dateType;
    this.maxDate = maxDate;
    this.minDate = minDate;

    [this.dateTimeFormat, this.atomicDateObjectFunction] = this.setFormats();
  }

  dateHandlerCreator = (date: Date = new Date()): AtomicDateObjectCreator => {
    // DANGER WILL ROBERTSON this changes seed date!!!
    const dateTimeFormat = this.dateTimeFormat;

    return (index: number): AtomicDateObject => {
      date.setDate(date.getDate() + index)
      const newDate = new Date(date.getTime())
      return new AtomicDateObject(newDate, undefined, dateTimeFormat);
    }
  }

  monthHandlerCreator = (date: Date = new Date()): AtomicDateObjectCreator => {
    // sets day to first of month
    const dateTimeFormat = this.dateTimeFormat;
    if (date.getMonth() !== 0) {
      date.setMonth(0)
    }

    return (index: number): AtomicDateObject => {
      const newDate = new Date(date.getTime())
      newDate.setMonth(newDate.getMonth() + index)
      return new AtomicDateObject(newDate, undefined, dateTimeFormat);
    }
  }

  dayHandlerCreator = (date: Date = new Date()): AtomicDateObjectCreator => {
    // sets series to 0/sunday
    const dateTimeFormat = this.dateTimeFormat;
    if (date.getDay() != 0) {
      date.setDate(date.getDate() - date.getDay());
    }

    const hander: AtomicDateObjectCreator = (
      index: number
    ): AtomicDateObject => {
      const newDate = new Date(date.getTime());
      newDate.setDate(date.getDate() + index);
      return new AtomicDateObject(newDate, undefined, dateTimeFormat);
    };

    return hander;
  };

  yearHandlerCreator = (date: Date = new Date()): AtomicDateObjectCreator => {
    // sets day to jan 1
    const dateTimeFormat = this.dateTimeFormat;
    const seedDate = new Date(date.getTime())
    seedDate.setMonth(0)
    seedDate.setDate(1)

    const hander: AtomicDateObjectCreator = (
      index: number
    ): AtomicDateObject => {
      const newDate = new Date(seedDate.getTime());
      newDate.setFullYear(seedDate.getFullYear() + index)
      return new AtomicDateObject(newDate, undefined, dateTimeFormat);
    };

    return hander;
  };

  hourHandlerCreator = (date: Date = new Date()): AtomicDateObjectCreator => {
    // business logic has to determine if it starts from current or midnight
    const dateTimeFormat = this.dateTimeFormat;
    date.setMinutes(1)

    return (index: number): AtomicDateObject => {
      const newDate = new Date(date.getTime())
      newDate.setHours(date.getHours() + index)
      return new AtomicDateObject(newDate, undefined, dateTimeFormat)
    } 
  }

  private setFormats = (
    dateType: DateType = this.dateType
  ): [DateTimeFormat, AtomicDateObjectCreator] => {
    switch (dateType) {
      case DateType.MONTH:
        // each month in on 1st day of month
        return [
          { month: "long" },
          this.monthHandlerCreator(),
        ];
      case DateType.DATE:
        return [
          { day: "numeric", month: "long", year: "numeric" },
          this.dateHandlerCreator(),
        ];
      case DateType.DAY:
        // returns days of the week, starts always with 0
        return [{ weekday: "long" }, this.dayHandlerCreator()];
      case DateType.YEAR:
        // returns year plus offset, year has to set to jan 1
        return [{ year: "numeric" }, this.monthHandlerCreator()];
      case DateType.WEEK:
        // returns seed date - ...6 
        return [
          { weekday: "long", day: "numeric", month: "long" },
          this.dateHandlerCreator(),
        ];
      case (DateType.HOUR, DateType.HOUR24):
        return [{ hour: "2-digit" }, this.monthHandlerCreator()];
      default:
        return [
          { day: "numeric", month: "numeric", year: "numeric" },
          this.hourHandlerCreator(),
        ];
    }
  };

  // API
  dateArray(quantity: number = 1): AtomicDateObject[] {
    quantity = Math.max(quantity, 1)

    const returnValue = []

    for (let i = 0; i < quantity; i++) {
      const newADO = this.atomicDateObjectFunction(i)
      returnValue.push(newADO)
    }

    return returnValue
  }
}
