/*
  The AtomicDate object takes the date it has been given
  and refines the date based on its type,
  then returns label and date based on that model.
  It is used to represent a single point in time.
*/

import DateTypeFormat from "../enums/DateTimeFormat";

interface AtomicDateObject {
  date: Date,
  viewString: string,
}

class AtomicDateObject {
  constructor(date: Date, locale: string[] = ['en-US'], options: DateTypeFormat) {
    this.date = date;
    this.viewString = date.toLocaleString(locale, options)
  }
}

export default AtomicDateObject