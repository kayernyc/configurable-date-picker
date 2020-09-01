import ViewConfigurationAdapter from './ViewConfigurationAdapter';
import ViewConfiguration from '../enums/ViewConfiguration';
import DateType from '../enums/DateType';
import ViewType from '../enums/ViewType';

const seedViewConfiguration: ViewConfiguration = {
  dateType: DateType.CALENDAR,
  viewType: ViewType.LIST,
};

// TODO take this from utilities in future
const matchObjectToViewConfiguration = (object: ViewConfiguration) => {
  const objectKeys = Object.keys(object);
  const vCKeys = ['dateType', 'viewType'];

  const keysMissing = vCKeys.some((key) => {
    return !objectKeys.includes(key);
  });

  if (keysMissing) {
    return false;
  }

  if (
    object.dateType !== undefined &&
    [0, 1, 2, 3, 4, 5, 6, 7].includes(object.dateType) &&
    object.viewType !== undefined  &&
    [0, 1, 2, 3, 4, 5, 6, 7].includes(object.viewType)
  ) {
    return true;
  }

  return false;
}

describe('ViewConfigurationAdapter exists', () => {
  it('exists', () => {
    const viewConfigurationAdapter = new ViewConfigurationAdapter(
      seedViewConfiguration
    );
    expect(ViewConfigurationAdapter).toBeTruthy();
  });
});

describe('ViewConfigurationAdapter type checker', () => {
  const viewConfigurationAdapter = new ViewConfigurationAdapter(
    seedViewConfiguration
  );

  it('returns true if the object has the correct keys and the values are 0s', () => {
    const testObject = {'dateType':0,'viewType':0}
    const result = viewConfigurationAdapter.matchObjectToViewConfiguration(testObject)
    expect(result).toBe(true)
  });

  it('returns true if the object has the correct keys and the values are valid but not 0s', () => {
    const objectArray = [
      {'dateType':1,'viewType':0},
      {'dateType':2,'viewType':0},
      {'dateType':3,'viewType':0},
      {'dateType':4,'viewType':0},
      {'dateType':5,'viewType':0},
      {'dateType':6,'viewType':0},
      {'dateType':7,'viewType':0},
      {'dateType':1,'viewType':1},
      {'dateType':2,'viewType':1},
      {'dateType':3,'viewType':1},
      {'dateType':4,'viewType':1},
      {'dateType':5,'viewType':1},
      {'dateType':6,'viewType':1},
      {'dateType':7,'viewType':1},
    ]

    objectArray.forEach(testObject => {
      const result = viewConfigurationAdapter.matchObjectToViewConfiguration(testObject)
      expect(result).toBe(true)
    });
  });

  it('returns false if the object has the correct keys but the values are invalid', () => {
    const objectArray: ViewConfiguration | any[] = [
      {'dateType':1,'viewType':undefined},
      {'dateType':2,'viewType':null},
      {'dateType':8,'viewType':1},
      {'dateType':undefined,'viewType':1},
      {'dateType':null,'viewType':1},
      {'dateType':'month','viewType':1},
    ]

    objectArray.forEach(testObject => {
      const result = viewConfigurationAdapter.matchObjectToViewConfiguration(testObject)
      expect(result).toBe(false)
    });
  });
})

describe('ViewConfigurationAdapter dateArray', () => {
  const viewConfigurationAdapter = new ViewConfigurationAdapter(
    seedViewConfiguration
  );

  it('turns a valid configuration into a View Configuration', () => {
    const configObject: ViewConfiguration = {
      dateType: DateType.CALENDAR,
      viewType: ViewType.LIST,
    };

    const array = viewConfigurationAdapter.sanitizeConfigObj(
      seedViewConfiguration
    );

    expect(Array.isArray(array)).toBe(true);
    expect(matchObjectToViewConfiguration(array[0])).toBe(true);
  });

  it('returns an array of valid configurations if passed valid configurations', () => {
    const testArray = [
      {'dateType':0,'viewType':0}
    ];

    const resultArray = viewConfigurationAdapter.sanitizeConfigObj(testArray)
    expect(Array.isArray(resultArray)).toBe(true);
    expect(matchObjectToViewConfiguration(resultArray[0])).toBe(true);
  });


});

describe('ViewConfigurationAdapter string configuration', () => {
  const viewConfigurationAdapter = new ViewConfigurationAdapter(
    seedViewConfiguration
  );

  it('turns a valid date string into a View Configuration', () => {
    const array = viewConfigurationAdapter.sanitizeConfigObj('Month');

    expect(Array.isArray(array)).toBe(true);
  });

  it('turns a valid view string into a View Configuration', () => {
    const array = viewConfigurationAdapter.sanitizeConfigObj('grid');

    expect(Array.isArray(array)).toBe(true);
  });
});

describe('ViewConfigurationAdapter invalid configuration', () => {
  const viewConfigurationAdapter = new ViewConfigurationAdapter(
    seedViewConfiguration
  );

  it('rejects an empty array', () => {
    expect(() => {
      viewConfigurationAdapter.sanitizeConfigObj([]);
    }).toThrow(': [] is not an acceptable configuration parameter.');
  });

  it('rejects an invalid string', () => {
    expect(() => {
      viewConfigurationAdapter.sanitizeConfigObj('jelly');
    }).toThrow(': string jelly not a valid member or DateType or ViewType.');
  });
});
