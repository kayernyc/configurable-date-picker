import ViewConfigurationAdapter from "./ViewConfigurationAdapter";
import ViewConfiguration from "../enums/ViewConfiguration";
import DateType from "../enums/DateType";
import ViewType from "../enums/ViewType";

const seedViewConfiguration: ViewConfiguration = {
  dateType: DateType.CALENDAR,
  viewType: ViewType.LIST,
};

// TODO take this from utilities in future
const matchObjectToViewConfiguration = (obj: ViewConfiguration) => {
  const objKeys = Object.keys(obj);
  const vCKeys = ["dateType", "viewType"];

  const keysMissing = vCKeys.some((key) => {
    return !objKeys.includes(key);
  });

  if (keysMissing) {
    return false;
  }

  if (
    obj.dateType !== undefined &&
    [0, 1, 2, 3, 4, 5, 6, 7].includes(obj.dateType) &&
    obj.viewType !== undefined  &&
    [0, 1, 2, 3, 4, 5, 6, 7].includes(obj.viewType)
  ) {
    return true;
  }

  return false;
}

describe("ViewConfigurationAdapter exists", () => {
  it("exists", () => {
    const viewConfigurationAdapter = new ViewConfigurationAdapter(
      seedViewConfiguration
    );
    expect(ViewConfigurationAdapter).toBeTruthy();
  });
});

describe("ViewConfigurationAdapter type checker", () => {
  const viewConfigurationAdapter = new ViewConfigurationAdapter(
    seedViewConfiguration
  );

  it("returns true if the object has the correct keys and the values are 0s", () => {
    const testObj = {"dateType":0,"viewType":0}
    const result = viewConfigurationAdapter.matchObjectToViewConfiguration(testObj)
    expect(result).toBe(true)
  });

  it("returns true if the object has the correct keys and the values are valid but not 0s", () => {
    const objArray = [
      {"dateType":1,"viewType":0},
      {"dateType":2,"viewType":0},
      {"dateType":3,"viewType":0},
      {"dateType":4,"viewType":0},
      {"dateType":5,"viewType":0},
      {"dateType":6,"viewType":0},
      {"dateType":7,"viewType":0},
      {"dateType":1,"viewType":1},
      {"dateType":2,"viewType":1},
      {"dateType":3,"viewType":1},
      {"dateType":4,"viewType":1},
      {"dateType":5,"viewType":1},
      {"dateType":6,"viewType":1},
      {"dateType":7,"viewType":1},
    ]

    objArray.forEach(testObj => {
      const result = viewConfigurationAdapter.matchObjectToViewConfiguration(testObj)
      expect(result).toBe(true)
    });
  });

  it("returns false if the object has the correct keys but the values are invalid", () => {
    const objArray: ViewConfiguration | any[] = [
      {"dateType":1,"viewType":undefined},
      {"dateType":2,"viewType":null},
      {"dateType":8,"viewType":1},
      {"dateType":undefined,"viewType":1},
      {"dateType":null,"viewType":1},
      {"dateType":'month',"viewType":1},
    ]

    objArray.forEach(testObj => {
      const result = viewConfigurationAdapter.matchObjectToViewConfiguration(testObj)
      expect(result).toBe(false)
    });
  });
})

describe("ViewConfigurationAdapter dateArray", () => {
  const viewConfigurationAdapter = new ViewConfigurationAdapter(
    seedViewConfiguration
  );

  it("turns a valid configuration into a View Configuration", () => {
    const configObj: ViewConfiguration = {
      dateType: DateType.CALENDAR,
      viewType: ViewType.LIST,
    };

    const arr = viewConfigurationAdapter.sanitizeConfigObj(
      seedViewConfiguration
    );

    expect(Array.isArray(arr)).toBe(true);
    expect(matchObjectToViewConfiguration(arr[0])).toBe(true);
  });

  it("returns an array of valid configurations if passed valid configurations", () => {
    const testArr = [
      {"dateType":0,"viewType":0}
    ];

    const resultArr = viewConfigurationAdapter.sanitizeConfigObj(testArr)
    expect(Array.isArray(resultArr)).toBe(true);
    expect(matchObjectToViewConfiguration(resultArr[0])).toBe(true);
  });


});

describe("ViewConfigurationAdapter string configuration", () => {
  const viewConfigurationAdapter = new ViewConfigurationAdapter(
    seedViewConfiguration
  );

  it("turns a valid date string into a View Configuration", () => {
    const arr = viewConfigurationAdapter.sanitizeConfigObj("Month");

    expect(Array.isArray(arr)).toBe(true);
  });

  it("turns a valid view string into a View Configuration", () => {
    const arr = viewConfigurationAdapter.sanitizeConfigObj("grid");

    expect(Array.isArray(arr)).toBe(true);
  });
});

describe("ViewConfigurationAdapter invalid configuration", () => {
  const viewConfigurationAdapter = new ViewConfigurationAdapter(
    seedViewConfiguration
  );

  it("rejects an empty array", () => {
    expect(() => {
      viewConfigurationAdapter.sanitizeConfigObj([]);
    }).toThrow(`: [] is not an acceptable configuration parameter.`);
  });

  it("rejects an invalid string", () => {
    expect(() => {
      viewConfigurationAdapter.sanitizeConfigObj('jelly');
    }).toThrow(": string jelly not a valid member or DateType or ViewType.");
  });
});
