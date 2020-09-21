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
  private today: Date

  static datesAreSameDay = (candidateDay: Date, today: Date): boolean => {
    if ((candidateDay.getFullYear() !== today.getFullYear())
      || (candidateDay.getMonth() !== today.getMonth())
      || (candidateDay.getDate() !== today.getDate())) {
      return false;
    }

    return true
  }

  createInnerHTML = (config: { week: AtomicDateObject[], splitWeek?: boolean, month?: number, today?: Date }): string => {
    config = { ...{ today: this.today, splitWeek: false }, ...config };
    const { week, splitWeek, month, today } = config;
    let innerHTML = ''
    // (splitWeek && month !== undefined)

    week.forEach((ado: AtomicDateObject, index: number) => {
      const classList = ['weekday'];
      let contentString = ado.viewString;

      if (!splitWeek || (month !== undefined && ado.date.getMonth() === month)) {
        classList.push('ado-date-view')
        if (WeekDateObject.datesAreSameDay(ado.date, today)) {
          classList.push('date-today')
        }
      }

      if (splitWeek && month !== undefined) {
        if (ado.date.getMonth() !== month) {
          contentString = '';
        }
      }

      const classString = classList.join(' ')

      innerHTML += `<div class="${classString}" ${DATA_ADO_STRING}=${index}>${contentString}</div>`;
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

    this.today = new Date();
    this.today.setHours(1);

    const [adoWeek, adoMonth, split] = this.configureWeek(week, locale)
    this.week = adoWeek;
    this.month = adoMonth;
    this.split = split;
    this.viewString = this.createInnerHTML({ week: this.week, splitWeek: split });
  }

  public splitWeek(latter = false): void {
    this.month = new Date(this.date.getTime())
    let month = this.month.getMonth()

    if (latter) {
      month = (month + 1) % 12;
    }

    this.viewString = this.createInnerHTML({ week: this.week, splitWeek: this.split, month });
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
