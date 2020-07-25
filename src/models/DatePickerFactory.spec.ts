import DatePickerFactory from "./DatePickerFactory";
import ViewConfiguration from "../enums/ViewConfiguration";
import DateType from "../enums/DateType";
import ViewType from "../enums/ViewType";

const configs = [
  {
    dateType: DateType.CALENDAR,
    viewType: ViewType.LIST,
  },
  {
    dateType: DateType.DATE,
    viewType: ViewType.LIST,
  },
  {
    dateType: DateType.DAY,
    viewType: ViewType.LIST,
  },
  {
    dateType: DateType.HOUR,
    viewType: ViewType.LIST,
  },
  {
    dateType: DateType.HOUR24,
    viewType: ViewType.LIST,
  },
  {
    dateType: DateType.MONTH,
    viewType: ViewType.LIST,
  },
  {
    dateType: DateType.WEEK,
    viewType: ViewType.LIST,
  },
  {
    dateType: DateType.YEAR,
    viewType: ViewType.LIST,
  }
]

describe("DatePickerFactory exists", () => {
  configs.forEach(config => {
    it("exists", () => {
      const datePickerFactory = new DatePickerFactory(config);
      expect(datePickerFactory).toBeTruthy();
    });
  })
});

describe("DatePickerFactory dateArray", () => {
  configs.forEach(config => {
    it("should return an array", () => {
      const datePickerFactory = new DatePickerFactory(config);
      const arr = datePickerFactory.dateArray(1);
  
      expect(Array.isArray(arr)).toBe(true);
    });
  })
});
