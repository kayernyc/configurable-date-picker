/*
  Month is Jan, Feb, etc
  Date is calendar in grid, but dd/mm/yy in list
  Day is Monday, Tuesday, etc
  Year is 1999, 2000, etc
  Week is 7 days back from current date
  Hour is Hour + AM/PM
  Hour24 is military time
  Calendar is year/month/date
*/

export enum DateType {
  MONTH,
  DATE,
  DAY,
  YEAR,
  WEEK,
  HOUR,
  HOUR24,
  CALENDAR,
}
