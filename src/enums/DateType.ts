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

enum DateType {
  MONTH,
  DATE,
  DAY,
  YEAR,
  WEEK,
  HOUR,
  HOUR24,
  CALENDAR,
}

export default DateType
