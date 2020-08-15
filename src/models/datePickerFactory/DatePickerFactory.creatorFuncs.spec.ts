import DatePickerFactory from "./DatePickerFactory";
import ViewConfiguration from "../../enums/ViewConfiguration";
import DateType from "../../enums/DateType";
import ViewType from "../../enums/ViewType";
import DateTimeFormat from "../../enums/DateTimeFormat";
import { DatePickerCreatorFuncs } from "./DatePickerCreatorFuncs";

const seedViewConfiguration: ViewConfiguration = {
  dateType: DateType.CALENDAR,
  viewType: ViewType.LIST,
};

const datePickerFactory = new DatePickerFactory(seedViewConfiguration);
const format: DateTimeFormat = {
  day: "numeric",
  month: "numeric",
  year: "numeric",
};
const seedDate = new Date("August 1, 1975 23:15:30");

describe("dateHandlerCreator function", () => {
  describe("seeded with a date", () => {
    const dateFunction = DatePickerCreatorFuncs.dateHandlerCreator(format, seedDate);
    expect(typeof dateFunction).toBe("function");

    let counter = 1;

    for (let i = 0; i < 7; i++) {
      it(`returns August ${
        1 + counter
      } when initialized with a seed date and passed an index`, () => {
        const testDay = dateFunction(1);
        counter++;
        expect(typeof testDay).toBe("object");
        expect(testDay.date.getDate()).toBe(counter);
      });
    }
  });
});

describe("dayHandlerCreator function", () => {
  describe("seeded with a date", () => {
    const dayFunction = DatePickerCreatorFuncs.dayHandlerCreator(format, seedDate);
    expect(typeof dayFunction).toBe("function");

    for (let i = 0; i < 7; i++) {
      it(`returns ${i} when initialized with a seed date and passed an index`, () => {
        const testDay = dayFunction(i);
        expect(typeof testDay).toBe("object");
        expect(testDay.date.getDay()).toBe(i);
      });
    }
  });

  describe("seeded without a date", () => {
    const dayFunction = DatePickerCreatorFuncs.dayHandlerCreator(format);
    expect(typeof dayFunction).toBe("function");

    for (let i = 0; i < 7; i++) {
      it(`returns ${i} when passed an index`, () => {
        const testDay = dayFunction(i);
        expect(typeof testDay).toBe("object");
        expect(testDay.date.getDay()).toBe(i);
      });
    }
  });
});

describe("hourHandlerCreator function", () => {
  describe("seeded with a PM date", () => {
    // Date is PM, count should start at 12
    const hourFunction = DatePickerCreatorFuncs.hourHandlerCreator(format, seedDate);
    expect(typeof hourFunction).toBe("function");

    for (let i = 0; i < 24; i++) {
      it(`returns August ${i} when initialized with a seed date and passed an index`, () => {
        const testDay = hourFunction(i);
        expect(typeof testDay).toBe("object");
        expect(testDay.date.getHours()).toBe((12 + i) % 24);
      });
    }
  });

  describe("seeded with a AM date", () => {
    // Date is PM, count should start at 12
    const newSeedDate = new Date(seedDate.getTime())
    newSeedDate.setHours(1);
    const hourFunction = DatePickerCreatorFuncs.hourHandlerCreator(format, newSeedDate);
    expect(typeof hourFunction).toBe("function");

    for (let i = 0; i < 24; i++) {
      it(`returns August ${i} when initialized with a seed date and passed an index`, () => {
        const testDay = hourFunction(i);
        expect(typeof testDay).toBe("object");
        expect(testDay.date.getHours()).toBe((i) % 24);
      });
    }
  });
});

describe("monthHandlerCreator function", () => {
  describe("seeded with a date", () => {
    const monthFunction = DatePickerCreatorFuncs.monthHandlerCreator(
      format,
      seedDate
    );
    expect(typeof monthFunction).toBe("function");

    for (let i = 0; i < 12; i++) {
      it(`returns ${i} when initialized with a seed date and passed an index`, () => {
        const testDay = monthFunction(i);
        expect(typeof testDay).toBe("object");
        expect(testDay.date.getMonth()).toBe(i);
      });
    }
  });

  describe("seeded with a date and the month is january", () => {
    const monthFunction = DatePickerCreatorFuncs.monthHandlerCreator(
      format,
      seedDate
    );
    expect(typeof monthFunction).toBe("function");

    const newSeedDate = new Date(seedDate.getTime())
    newSeedDate.setMonth(0)

    for (let i = 0; i < 12; i++) {
      it(`returns ${i} when initialized with a seed date and passed an index`, () => {
        const testDay = monthFunction(i);
        expect(typeof testDay).toBe("object");
        expect(testDay.date.getMonth()).toBe(i);
      });
    }
  });
});

describe("yearHandlerCreator function", () => {
  describe("seeded with a date", () => {
    const yearFunction = DatePickerCreatorFuncs.yearHandlerCreator(format, seedDate);
    expect(typeof yearFunction).toBe("function");

    for (let i = 0; i < 7; i++) {
      it(`returns ${
        1975 + i
      } when initialized with a seed date and passed an index`, () => {
        const testDay = yearFunction(i);
        expect(typeof testDay).toBe("object");
        expect(testDay.date.getFullYear()).toBe(1975 + i);
      });
    }
  });
})
