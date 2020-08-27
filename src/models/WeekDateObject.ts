/**
 * This ADO contains a grid of ADOs, representing a week.
 * Which month a CDO "belongs" to depends on the majority
 * of days in that week.
 * The week starts on Gregorian Sunday
 */

import AtomicDateObject from "./AtomicDateObject";
import DateTypeFormat from "../enums/DateTimeFormat";

export default class WeekDateObject implements AtomicDateObject {
  date: Date;
  index: number;
  next?: AtomicDateObject;
  prev?: AtomicDateObject;
  viewString: string;

  week: AtomicDateObject[];
  innerHTML: string;
  month: Date;

  private dateTypeFormat: DateTypeFormat

  static createInnerHTML = (week: AtomicDateObject[]): string => {
    return week.reduce((acc: string, ado: AtomicDateObject, index: number) => {
      acc += `<div class="weekday" data-ado-index=${index}>${ado.viewString}</div>`
      return acc;
    }, '');
  }

  constructor(
    week: Date[],
    locale: string[] = ["en-US"],
    options: DateTypeFormat,
    index: number
  ) {
    this.index = index;
    this.date = week[0];
    this.dateTypeFormat = options;

    const [adoWeek, adoMonth] = this.configureWeek(week, locale)
    this.week = adoWeek
    this.month = adoMonth
    this.viewString = WeekDateObject.createInnerHTML(this.week)
  }

  private configureWeek = (week: Date[], locale: string[], options: DateTypeFormat = this.dateTypeFormat): [AtomicDateObject[], Date] => {
    let month = week[0]
    const adoWeek = week.map((date, index) => {
      if (index > 2 && date.getDate() === 1) {
        month = date
      }
      return new AtomicDateObject(date, locale, { day: "numeric"}, index)
    })

    return [adoWeek, month]
  }
}