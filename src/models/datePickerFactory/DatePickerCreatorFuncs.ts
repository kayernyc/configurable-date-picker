import AtomicDateObject from "../AtomicDateObject";
import { AtomicDateObjectCreator } from "./DatePickerFactoryTypes";
import DateTimeFormat from "../../enums/DateTimeFormat";

export const DatePickerCreatorFuncs = {
  dateHandlerCreator: (
    format: DateTimeFormat,
    date: Date = new Date()
  ): AtomicDateObjectCreator => {
    const dateTimeFormat = format;
    const seedDate = new Date(date.getTime());

    return (index: number): AtomicDateObject => {
      const newDate = new Date(seedDate.getTime());
      newDate.setDate(seedDate.getDate() + index);

      return new AtomicDateObject(newDate, undefined, dateTimeFormat, index);
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

    return (index: number): AtomicDateObject => {
      const newDate = new Date(seedDate.getTime());
      newDate.setMonth(newDate.getMonth() + index);
      return new AtomicDateObject(newDate, undefined, dateTimeFormat, index);
    };
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

    const hander: AtomicDateObjectCreator = (
      index: number
    ): AtomicDateObject => {
      const newDate = new Date(seedDate.getTime());

      newDate.setDate(seedDate.getDate() + index);
      return new AtomicDateObject(newDate, undefined, dateTimeFormat, index);
    };

    return hander;
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

    const hander: AtomicDateObjectCreator = (
      index: number
    ): AtomicDateObject => {
      const newDate = new Date(seedDate.getTime());
      newDate.setFullYear(seedDate.getFullYear() + index);
      return new AtomicDateObject(newDate, undefined, dateTimeFormat, index);
    };

    return hander;
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

    return (index: number): AtomicDateObject => {
      const newDate = new Date(seedDate.getTime());
      newDate.setHours(seedDate.getHours() + index);
      return new AtomicDateObject(newDate, undefined, dateTimeFormat, index);
    };
  },
};
