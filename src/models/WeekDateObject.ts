/**
 * This ADO contains a grid of ADOs, representing a week.
 * Which month a CDO "belongs" to depends on the majority
 * of days in that week.
 * The week starts on Gregorian Sunday
 */

import AtomicDateObject from './AtomicDateObject';
import DateTypeFormat from '../enums/DateTimeFormat';
import { DATA_ADO_STRING } from '../views/virtualDom/VirtualDomConst';

export default class WeekDateObject implements AtomicDateObject {
  date: Date;
  index: number;
  next?: AtomicDateObject;
  prev?: AtomicDateObject;
  viewString: string;

  split = false;
  week: AtomicDateObject[];
  innerHTML: string;
  month: Date;

  private dateTypeFormat: DateTypeFormat

  static createInnerHTML = (week: AtomicDateObject[], splitWeek = false, month?: number): string => {
    let innerHTML = ''

    week.forEach((ado: AtomicDateObject, index: number) => {
      let newElement = `<div class="weekday ado-date-view" ${DATA_ADO_STRING}=${index}>${ado.viewString}</div>`;
      if (splitWeek && month !== undefined) {
        if (ado.date.getMonth() !== month) {
          newElement = '<div class="weekday"></div>';
        }
      }

      innerHTML += newElement
    })

    return innerHTML
  }

  constructor(
    week: Date[],
    locale: string[] = ['en-US'],
    options: DateTypeFormat,
    index: number
  ) {
    this.index = index;
    this.date = week[0];
    this.dateTypeFormat = options;

    const [adoWeek, adoMonth, split] = this.configureWeek(week, locale)
    this.week = adoWeek;
    this.month = adoMonth;
    this.split = split;
    this.viewString = WeekDateObject.createInnerHTML(this.week, split);
  }

  public splitWeek(latter = false): void {
    this.month = new Date(this.date.getTime())
    let month = this.month.getMonth()

    if (latter) {
      month = (month + 1) % 12;
    }

    this.viewString = WeekDateObject.createInnerHTML(this.week, this.split, month);
  }

  private configureWeek = (week: Date[], locale: string[], options: DateTypeFormat = this.dateTypeFormat): [AtomicDateObject[], Date, boolean] => {
    let month = week[0]
    let split = false;
    const adoWeek = week.map((date, index) => {
      if (index > 0 && date.getDate() === 1) {
        split = true
        if (index > 2) {
          month = date;
        }
      }
      return new AtomicDateObject(date, locale, options, index);
    })

    return [adoWeek, month, split];
  }
}
