import AtomicDateObject from '../AtomicDateObject';
import { AtomicDateObjectCreator } from './DatePickerFactoryTypes';
import DateTimeFormat from '../../enums/DateTimeFormat';
import WeekDateObject from '../WeekDateObject';

export const DatePickerCreatorFuncs = {
  dateHandlerCreator: (
    format: DateTimeFormat,
    date: Date = new Date()
  ): AtomicDateObjectCreator => {
    console.log(`DATE Handler ${date.getFullYear()}`)
    const dateTimeFormat = format;
    const seedDate = new Date(date.getTime());

    return (index: number): AtomicDateObject[] => {
      const newDate = new Date(seedDate.getTime());
      newDate.setDate(seedDate.getDate() + index);

      return [new AtomicDateObject(newDate, undefined, dateTimeFormat, index)];
    };
  },

  weekHandlerCreator: (
    format: DateTimeFormat,
    date: Date = new Date()
  ): AtomicDateObjectCreator => {
    const dateTimeFormat = format;
    const seedDate = new Date(date.getTime());

    return (index: number): AtomicDateObject[] => {
      const newDate = new Date(seedDate.getTime());
      const newCalendarDate = seedDate.getDate() + index;
      newDate.setDate(newCalendarDate);

      return [new AtomicDateObject(newDate, undefined, dateTimeFormat, index)];
    };
  },

  monthHandlerCreator: (
    format: DateTimeFormat,
    date: Date = new Date()
  ): AtomicDateObjectCreator => {
    // sets day to first of month
    const dateTimeFormat = format;
    const seedDate = new Date(date.getTime());

    if (seedDate.getMonth() !== 0) {
      seedDate.setMonth(0);
    }

    return (index: number): AtomicDateObject[] => {
      const newDate = new Date(seedDate.getTime());
      newDate.setMonth(newDate.getMonth() + index);
      return [new AtomicDateObject(newDate, undefined, dateTimeFormat, index)];
    };
  },

  calendarHandlerCreator: (
    format: DateTimeFormat,
    date: Date = new Date(),
    grouped = false
  ): AtomicDateObjectCreator => {
    // sets series to 0/sunday
    const dateTimeFormat = format;
    const seedDate = new Date(date.getTime());

    if (seedDate.getUTCDay() !== 0) {
      const delta = seedDate.getDate() - seedDate.getDay();
      const timeDifference = seedDate.getTimezoneOffset() / 60;

      seedDate.setDate(delta);
      seedDate.setHours(seedDate.getHours() - timeDifference);
    }

    const handler: AtomicDateObjectCreator = (
      index: number
    ): WeekDateObject[] => {
      const DAYS_IN_MILLISECONDS = 86_400_000;

      const startingIndex = 7 * index
      const newDate = new Date(seedDate.getTime());
      newDate.setTime(seedDate.getTime() + (startingIndex * DAYS_IN_MILLISECONDS));

      const newWeek: Date[] = [];

      for (let i = 0; i < 7; i++) {
        const weekDate = new Date(newDate.getTime());
        weekDate.setTime(newDate.getTime() + (i * DAYS_IN_MILLISECONDS));
        newWeek.push(weekDate);
      }

      const weekObject = new WeekDateObject(newWeek, undefined, dateTimeFormat, index);

      if (grouped && weekObject.split) {
        weekObject.splitWeek(false);
        const weekObject2 = new WeekDateObject(newWeek, undefined, dateTimeFormat, index);
        weekObject2.splitWeek(true);

        weekObject.next = weekObject2;
        weekObject2.prev = weekObject;
        return [weekObject, weekObject2];
      }

      return [weekObject];
    };

    return handler;
  },

  dayHandlerCreator: (
    format: DateTimeFormat,
    date: Date = new Date()
  ): AtomicDateObjectCreator => {
    // sets series to 0/sunday
    const dateTimeFormat = format;
    const seedDate = new Date(date.getTime());

    if (seedDate.getUTCDay() !== 0) {
      const delta = seedDate.getDate() - seedDate.getDay();
      const timeDifference = seedDate.getTimezoneOffset() / 60;

      seedDate.setDate(delta);
      seedDate.setHours(seedDate.getHours() - timeDifference);
    }

    const handler: AtomicDateObjectCreator = (
      index: number
    ): AtomicDateObject[] => {
      const newDate = new Date(seedDate.getTime());

      newDate.setDate(seedDate.getDate() + index);
      return [new AtomicDateObject(newDate, undefined, dateTimeFormat, index)];
    };

    return handler;
  },

  yearHandlerCreator: (
    format: DateTimeFormat,
    date: Date = new Date()
  ): AtomicDateObjectCreator => {
    // sets day to jan 1
    const dateTimeFormat = format;
    const seedDate = new Date(date.getTime());

    seedDate.setMonth(0);
    seedDate.setDate(1);

    const handler: AtomicDateObjectCreator = (
      index: number
    ): AtomicDateObject[] => {
      const newDate = new Date(seedDate.getTime());
      newDate.setFullYear(seedDate.getFullYear() + index);
      return [new AtomicDateObject(newDate, undefined, dateTimeFormat, index)];
    };

    return handler;
  },

  hourHandlerCreator: (
    format: DateTimeFormat,
    date: Date = new Date()
  ): AtomicDateObjectCreator => {
    // business logic has to determine if it starts from current or midnight
    const dateTimeFormat = format;
    const seedDate = new Date(date.getTime());

    seedDate.setHours(0);
    seedDate.setMinutes(1);

    return (index: number): AtomicDateObject[] => {
      const newDate = new Date(seedDate.getTime());
      newDate.setHours(seedDate.getHours() + index);
      return [new AtomicDateObject(newDate, undefined, dateTimeFormat, index)];
    };
  },
};
