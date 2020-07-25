import DatePickerFactory from "./DatePickerFactory";
import ViewConfiguration from "../enums/ViewConfiguration";
import DateType from "../enums/DateType";
import ViewType from "../enums/ViewType";

const seedViewConfiguration: ViewConfiguration = {
  dateType: DateType.CALENDAR,
  viewType: ViewType.LIST,
};

const datePickerFactory = new DatePickerFactory(seedViewConfiguration);

describe("dateHandlerCreator function", () => {
  describe("seeded with a date", () => {
    const dateFunction = datePickerFactory.dateHandlerCreator(new Date('August 1, 1975 23:15:30'));
    expect(typeof dateFunction).toBe("function")

    let counter = 1
  
    for(let i = 0; i < 7; i ++) {
      it(`returns August ${1 + counter} when initialized with a seed date and passed an index`, () => {
        const testDay = dateFunction(1)
        counter ++
        expect(typeof testDay).toBe("object");
        expect(testDay.date.getDate()).toBe(counter)
      })
    };
  });
});

describe("dayHandlerCreator function", () => {
  describe("seeded with a date", () => {
    const dayFunction = datePickerFactory.dayHandlerCreator(new Date('August 1, 1975 23:15:30'));
    expect(typeof dayFunction).toBe("function")
  
    for(let i = 0; i < 7; i ++) {
      it(`returns ${i} when initialized with a seed date and passed an index`, () => {
        const testDay = dayFunction(i)
        expect(typeof testDay).toBe("object");
        expect(testDay.date.getDay()).toBe(i)
      })
    };
  });

  describe("seeded without a date", () => {
    const dayFunction = datePickerFactory.dayHandlerCreator(new Date());
    expect(typeof dayFunction).toBe("function")
  
    for(let i = 0; i < 7; i ++) {
      it(`returns ${i} when passed an index`, () => {
        const testDay = dayFunction(i)
        expect(typeof testDay).toBe("object");
        expect(testDay.date.getDay()).toBe(i)
      })
    };
  });
});

describe("hourHandlerCreator function", () => {
  describe("seeded with a date", () => {
    const hourFunction = datePickerFactory.hourHandlerCreator(new Date('August 1, 1975 23:15:30'));
    expect(typeof hourFunction).toBe("function")
  
    for(let i = 0; i < 24; i ++) {
      it(`returns August ${i} when initialized with a seed date and passed an index`, () => {
        const testDay = hourFunction(i)
        expect(typeof testDay).toBe("object");
        expect(testDay.date.getHours()).toBe((23 + i) % 24)
      })
    };
  });
});

describe("monthHandlerCreator function", () => {
  describe("seeded with a date", () => {
    const monthFunction = datePickerFactory.monthHandlerCreator(new Date('August 1, 1975 23:15:30'));
    expect(typeof monthFunction).toBe("function")
  
    for(let i = 0; i < 12; i ++) {
      it(`returns ${i} when initialized with a seed date and passed an index`, () => {
        const testDay = monthFunction(i)
        expect(typeof testDay).toBe("object");
        expect(testDay.date.getMonth()).toBe(i)
      })
    };
  });
});

describe("yearHandlerCreator function", () => {
  describe("seeded with a date", () => {
    const yearFunction = datePickerFactory.yearHandlerCreator(new Date('August 1, 1975 23:15:30'));
    expect(typeof yearFunction).toBe("function")
  
    for(let i = 0; i < 7; i ++) {
      it(`returns ${1975 + i} when initialized with a seed date and passed an index`, () => {
        const testDay = yearFunction(i)
        expect(typeof testDay).toBe("object");
        expect(testDay.date.getFullYear()).toBe(1975 + i)
      })
    };
  });
});
