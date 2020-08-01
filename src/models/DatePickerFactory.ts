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
  dateTimeFormat: DateTimeFormat;
  private atomicDateObjectFunction: AtomicDateObjectCreator;

  private configurationMap: Map<DateType, any> = new Map();

  constructor(config: ViewConfiguration) {
    const { dateType, maxDate, minDate } = config;
    this.dateType = dateType;
    this.maxDate = maxDate;
    this.minDate = minDate;

    [this.dateTimeFormat, this.atomicDateObjectFunction] = this.setFormats();
  }

  dateHandlerCreator = (
    format: DateTimeFormat,
    date: Date = new Date()
  ): AtomicDateObjectCreator => {
    // DANGER WILL ROBERTSON this changes seed date!!!
    const dateTimeFormat = this.dateTimeFormat || format;
    const seedDate = new Date(date.getTime())

    return (index: number): AtomicDateObject => {
      seedDate.setDate(seedDate.getDate() + index);
      const newDate = new Date(seedDate.getTime());
      return new AtomicDateObject(newDate, undefined, dateTimeFormat);
    };
  };

  monthHandlerCreator = (
    format: DateTimeFormat,
    date: Date = new Date()
  ): AtomicDateObjectCreator => {
    // sets day to first of month
    const dateTimeFormat = this.dateTimeFormat || format;
    const seedDate = new Date(date.getTime())

    if (seedDate.getMonth() !== 0) {
      seedDate.setMonth(0);
    }

    return (index: number): AtomicDateObject => {
      const newDate = new Date(seedDate.getTime());
      newDate.setMonth(newDate.getMonth() + index);
      return new AtomicDateObject(newDate, undefined, dateTimeFormat);
    };
  };

  dayHandlerCreator = (
    format: DateTimeFormat,
    date: Date = new Date()
  ): AtomicDateObjectCreator => {
    // sets series to 0/sunday
    const dateTimeFormat = this.dateTimeFormat || format;
    const seedDate = new Date(date.getTime())

    if (seedDate.getUTCDay() !== 0) {
      const delta = seedDate.getDate() - seedDate.getDay()
      const timeDifference = seedDate.getTimezoneOffset()/60
      
      seedDate.setDate(delta);
      seedDate.setHours(seedDate.getHours() - timeDifference)
    }
    
    const hander: AtomicDateObjectCreator = (
      index: number
    ): AtomicDateObject => {
      const newDate = new Date(seedDate.getTime());
      
      newDate.setDate(seedDate.getDate() + index);
      return new AtomicDateObject(newDate, undefined, dateTimeFormat);
    };

    return hander;
  };

  yearHandlerCreator = (
    format: DateTimeFormat,
    date: Date = new Date()
  ): AtomicDateObjectCreator => {
    // sets day to jan 1
    const dateTimeFormat = this.dateTimeFormat || format;
    const seedDate = new Date(date.getTime());

    seedDate.setMonth(0);
    seedDate.setDate(1);

    const hander: AtomicDateObjectCreator = (
      index: number
    ): AtomicDateObject => {
      const newDate = new Date(seedDate.getTime());
      newDate.setFullYear(seedDate.getFullYear() + index);
      return new AtomicDateObject(newDate, undefined, dateTimeFormat);
    };

    return hander;
  };

  hourHandlerCreator = (
    format: DateTimeFormat,
    date: Date = new Date()
  ): AtomicDateObjectCreator => {
    // business logic has to determine if it starts from current or midnight
    const dateTimeFormat = this.dateTimeFormat || format;
    const seedDate = new Date(date.getTime())

    seedDate.setMinutes(1);

    return (index: number): AtomicDateObject => {
      const newDate = new Date(seedDate.getTime());
      newDate.setHours(seedDate.getHours() + index);
      return new AtomicDateObject(newDate, undefined, dateTimeFormat);
    };
  };

  private setFormats = (
    dateType: DateType = this.dateType
  ): [DateTimeFormat, AtomicDateObjectCreator] => {
    let format: DateTimeFormat;

    switch (dateType) {
      case DateType.MONTH:
        // each month in on 1st day of month
        format = { month: "long" };
        return [format, this.monthHandlerCreator(format)];
      case DateType.DATE:
        format = { day: "numeric", month: "long", year: "numeric" };
        return [format, this.dateHandlerCreator(format)];
      case DateType.DAY:
        // returns days of the week, starts always with 0
        format = { weekday: "long" };
        return [format, this.dayHandlerCreator(format)];
      case DateType.YEAR:
        // returns year plus offset, year has to set to jan 1
        format = { year: "numeric" };
        return [format, this.monthHandlerCreator(format)];
      case DateType.WEEK:
        // returns seed date - ...6
        format = { weekday: "long", day: "numeric", month: "long" };
        return [
          { weekday: "long", day: "numeric", month: "long" },
          this.dateHandlerCreator(format),
        ];
      case (DateType.HOUR, DateType.HOUR24):
        format = { hour: "numeric" };
        return [format, this.hourHandlerCreator(format)];
      default:
        format = { day: "numeric", month: "numeric", year: "numeric" };
        return [format, this.dateHandlerCreator(format)];
    }
  };

  // API
  dateArray(quantity: number = 1): AtomicDateObject[] {
    quantity = Math.max(quantity, 1);

    const returnValue = [];

    console.log(this.atomicDateObjectFunction)

    for (let i = 0; i < quantity; i++) {
      const newADO = this.atomicDateObjectFunction(i);
      returnValue.push(newADO);
    }

    return returnValue;
  }
}
