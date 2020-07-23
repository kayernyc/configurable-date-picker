import DatePickerFactory from "./DatePickerFactory"
import ViewConfiguration from "../enums/ViewConfiguration"
import DateType from "../enums/DateType"
import ViewType from "../enums/ViewType"

const seedViewConfiguration: ViewConfiguration = {
  dateType: DateType.CALENDAR,
  viewType: ViewType.LIST,
};

describe("DatePickerFactory exists", () => {
  

  it("exists", () => {
    const datePickerFactory = new DatePickerFactory(seedViewConfiguration)
    expect(datePickerFactory).toBeTruthy();
  });
});

describe("DatePickerFactory dateArray", () => {
  it("should return an array", () => {
    const datePickerFactory = new DatePickerFactory(seedViewConfiguration)
    const arr = datePickerFactory.dateArray(1)

    expect(Array.isArray(arr)).toBe(true);
  });
});