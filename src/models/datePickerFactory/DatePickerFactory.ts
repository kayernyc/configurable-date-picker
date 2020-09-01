/**
 * Data model for dates
 * Supplies date objects for view
 */

/**
 * continuous is whether the view has a beginning or end
 * looping is whether the dates cycle. if looping is false
 * and the view is continuous, then dates are added to
 * the beginning or end
 */

/**
 * Month is Jan, Feb, etc
 * Date is a series of days
 * Day is Monday, Tuesday, etc
 * Year is 1999, 2000, etc
 * Week is 7 days back from current date
 * Hour is Hour + AM/PM
 * Hour24 is military time
 * Calendar is year/month/date
 */

import DateType from '../../enums/DateType';
import ViewConfiguration from '../../enums/ViewConfiguration';
import DateTimeFormat from '../../enums/DateTimeFormat';
import AtomicDateObject from '../AtomicDateObject';
import { AtomicDateObjectCreator } from './DatePickerFactoryTypes';
import { DatePickerCreatorFuncs } from './DatePickerCreatorFuncs';

const dataTypeDefaultLooping = {
  [DateType.CALENDAR]: false,
  [DateType.DATE]: false,
  [DateType.DAY]: true,
  [DateType.HOUR]: true,
  [DateType.HOUR24]: true,
  [DateType.MONTH]: true,
  [DateType.WEEK]: true,
  [DateType.YEAR]: false
}

export default class DatePickerFactory {
  looping: boolean;
  private dateType: DateType;
  private maxDate?: Date;
  private minDate?: Date;
  private grouped?: boolean;
  dateTimeFormat: DateTimeFormat;
  private atomicDateObjectFunction: AtomicDateObjectCreator;

  private configurationMap: Map<DateType, any> = new Map();

  constructor(config: ViewConfiguration) {
    const { dateType, maxDate, minDate, grouped } = config;
    this.dateType = dateType;
    this.maxDate = maxDate;
    this.minDate = minDate;
    this.grouped = grouped;
    this.looping = config.looping || dataTypeDefaultLooping[dateType];

    [this.dateTimeFormat, this.atomicDateObjectFunction] = this.setFormats();
  }

  private setFormats = (
    dateType: DateType = this.dateType
  ): [DateTimeFormat, AtomicDateObjectCreator] => {
    let format: DateTimeFormat;

    switch (dateType) {
      case DateType.CALENDAR:
        // each week, starting on sunday
        format = { day: 'numeric'};
        return [format, DatePickerCreatorFuncs.calendarHandlerCreator(format, undefined, this.grouped)];
      case DateType.MONTH:
        // each month in on 1st day of month
        format = { month: 'long' };
        return [format, DatePickerCreatorFuncs.monthHandlerCreator(format)];
      case DateType.DATE:
        format = { day: 'numeric', month: 'long', year: 'numeric' };
        return [format, DatePickerCreatorFuncs.dateHandlerCreator(format)];
      case DateType.DAY:
        // returns days of the week, starts always with 0
        format = { weekday: 'long' };
        return [format, DatePickerCreatorFuncs.dayHandlerCreator(format)];
      case DateType.YEAR:
        // returns year plus offset, year has to set to jan 1
        format = { year: 'numeric' };
        return [format, DatePickerCreatorFuncs.monthHandlerCreator(format)];
      case DateType.WEEK:
        // returns seed date - ...6
        format = { weekday: 'long', day: 'numeric', month: 'long' };
        return [
          { weekday: 'long', day: 'numeric', month: 'long' },
          DatePickerCreatorFuncs.dateHandlerCreator(format),
        ];
      case DateType.HOUR:
      case DateType.HOUR24:
        format = { hour: 'numeric' };
        return [format, DatePickerCreatorFuncs.hourHandlerCreator(format)];
      default:
        format = { day: 'numeric', month: 'numeric', year: 'numeric' };
        return [format, DatePickerCreatorFuncs.dateHandlerCreator(format)];
    }
  };

  // API
  /**
   * @param quantity: number
   * @param quantity
   */
  dateArray(quantity = 1): AtomicDateObject[] {
    quantity = Math.max(quantity, 1);

    let returnValue = [];

    for (let i = 0; i < quantity; i++) {
      const newAdoArray = this.atomicDateObjectFunction(i);
      returnValue = [...returnValue, ...newAdoArray];
    }

    return returnValue;
  }

  getAtomicDateObjectByIndex(index: number): AtomicDateObject[] {
    return this.atomicDateObjectFunction(index);
  }
}
