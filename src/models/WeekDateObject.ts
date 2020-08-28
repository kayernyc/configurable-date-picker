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

  split: boolean = false;
  week: AtomicDateObject[];
  innerHTML: string;
  month: Date;

  private dateTypeFormat: DateTypeFormat

  static createInnerHTML = (week: AtomicDateObject[], split = false, month?: number): string => {
    return week.reduce((acc: string, ado: AtomicDateObject, index: number) => {
      if (split && month !== undefined) {
        const adoMonth = ado.date.getMonth();
        acc += month === adoMonth ?
          `<div class="weekday" data-ado-index=${index}>${ado.viewString}</div>` :
          `<div class="weekday" ></div>`;
        return acc;
      }

      acc += `<div class="weekday" data-ado-index=${index}>${ado.viewString}</div>`;
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

    const [adoWeek, adoMonth, split] = this.configureWeek(week, locale)
    this.week = adoWeek;
    this.month = adoMonth;
    this.split = split;
    this.viewString = WeekDateObject.createInnerHTML(this.week, split);
  }

  public splitWeek(latter = false) {
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
      return new AtomicDateObject(date, locale, { day: "numeric" }, index);
    })

    return [adoWeek, month, split];
  }
}
