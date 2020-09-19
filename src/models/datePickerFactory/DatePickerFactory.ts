/**
 * Data model for dates
 * Supplies date objects for view
 */

/**
 * Month is Jan, Feb, etc
 * Date is a series of days
 * Day is Monday, Tuesday, etc
 * Year is 1999, 2000, etc
 * Week is 7 days forward from current date
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


export default class DatePickerFactory {
  private dateType: DateType;
  private maxDate?: Date;
  private minDate?: Date;
  private seedDate: Date;
  private grouped?: boolean;
  dateTimeFormat: DateTimeFormat;
  private atomicDateObjectFunction: AtomicDateObjectCreator;

  constructor(config: ViewConfiguration) {
    const { dateType, maxDate, minDate, grouped, seedDate } = config;

    this.dateType = dateType;
    this.maxDate = maxDate;
    this.minDate = minDate;
    this.grouped = grouped;
    this.seedDate = seedDate || new Date();

    [this.dateTimeFormat, this.atomicDateObjectFunction] = this.setFormats();
  }

  private setFormats = (
    dateType: DateType = this.dateType,
    seedDate: Date = this.seedDate,
    grouped = this.grouped,
  ): [DateTimeFormat, AtomicDateObjectCreator] => {
    let format: DateTimeFormat;

    switch (dateType) {
      case DateType.CALENDAR:
        // each week, starting on sunday
        format = { day: 'numeric' };
        return [format, DatePickerCreatorFuncs.calendarHandlerCreator(format, seedDate, grouped)];
      case DateType.MONTH:
        // each month in on 1st day of month
        format = { month: 'long' };
        return [format, DatePickerCreatorFuncs.monthHandlerCreator(format, seedDate)];
      case DateType.DATE:

        format = { day: 'numeric', month: 'long', year: 'numeric' };
        return [format, DatePickerCreatorFuncs.dateHandlerCreator(format, seedDate)];
      case DateType.DAY:
        // returns days of the week, starts always with 0
        format = { weekday: 'long' };
        return [format, DatePickerCreatorFuncs.dayHandlerCreator(format, seedDate)];
      case DateType.WEEK:
        format = { weekday: 'long', day: 'numeric', month: 'long' };
        return [
          { weekday: 'long', day: 'numeric', month: 'long' },
          DatePickerCreatorFuncs.dateHandlerCreator(format, seedDate),
        ];
      case DateType.YEAR:
        // returns year plus offset, year has to set to jan 1
        format = { year: 'numeric' };
        return [format, DatePickerCreatorFuncs.yearHandlerCreator(format, seedDate)];
      case DateType.HOUR:
      case DateType.HOUR24:
        format = { hour: 'numeric' };
        return [format, DatePickerCreatorFuncs.hourHandlerCreator(format, seedDate)];
      default:
        format = { day: 'numeric', month: 'numeric', year: 'numeric' };
        return [format, DatePickerCreatorFuncs.dateHandlerCreator(format, seedDate)];
    }
  };

  // API

  /**
   * @param quantity: number
   * @param quantity
   */
  dateArray(quantity = 1): AtomicDateObject[] {
    quantity = Math.max(quantity, 1);

    let returnValue: AtomicDateObject[] = [];

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
