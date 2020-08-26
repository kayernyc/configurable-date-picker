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
  month: Date;

  constructor(
    week: Date[],
    locale: string[] = ["en-US"],
    options: DateTypeFormat,
    index: number
  ) {
    this.index = index;
    this.date = week[0];
    this.viewString = this.date.toLocaleString(locale, options);

    const [adoWeek, adoMonth] = this.configureWeek(week, locale)
    this.week = adoWeek
    this.month = adoMonth
  }

  private configureWeek = (week: Date[], locale: string[]): [AtomicDateObject[], Date] => {
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