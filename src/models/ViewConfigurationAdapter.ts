import ViewConfiguration from '../enums/ViewConfiguration';
import ViewType from '../enums/ViewType';
import DateType from '../enums/DateType';

const seedViewConfiguration: ViewConfiguration = {
  dateType: DateType.CALENDAR,
  viewType: ViewType.LIST,
};

export default class ViewConfigurationAdapter {
  configDefaults: ViewConfiguration;

  constructor(configDefaults: ViewConfiguration = seedViewConfiguration) {
    this.configDefaults = configDefaults;
  }

  sanitizeConfigObj(configObject: any): ViewConfiguration[] {
    // convert all incoming to valid configObj arrays

    switch (true) {
      case this.matchObjectToViewConfiguration(configObject):
        return [configObject];

      case Array.isArray(configObject):
        const arrayCandidate: ViewConfiguration[] = configObject.reduce(
          (accumulator: ViewConfiguration[], object: any) => {
            return [...accumulator, ...this.sanitizeConfigObj(object)];
          },
          []
        );
        if (arrayCandidate.length === 0) {
          throw new Error(
            `: ${JSON.stringify(
              configObject
            )} is not an acceptable configuration parameter.`
          );
        }

        return arrayCandidate;

      case typeof configObject === 'string': {
        const vC = this.convertStringToViewConfiguration(configObject);
        return [vC];
      }
      default:
        throw new Error(
          `: ${JSON.stringify(
            configObject
          )} is not an acceptable configuration parameter.`
        );
    }
  }

  // TODO: Abstract and move to utilities

  matchObjectToViewConfiguration(object: ViewConfiguration): boolean {
    const objectKeys = Object.keys(object);
    const vCKeys = ['dateType', 'viewType'];

    const keysMissing = vCKeys.some((key) => {
      return !objectKeys.includes(key);
    });

    if (keysMissing) {
      return false;
    }

    if (
      // tslint:disable: no-string-literal
      object.dateType !== undefined &&
      [0, 1, 2, 3, 4, 5, 6, 7].includes(object.dateType) &&
      object.viewType !== undefined &&
      [0, 1, 2, 3, 4, 5, 6, 7].includes(object.viewType)
      // tslint:enable: no-string-literal
    ) {
      return true;
    }

    return false;
  }

  private seedViewConfigurationWithEnum(
    configDate?: DateType,
    configView?: ViewType,
    defaultDateType: DateType = this.configDefaults.dateType,
    // tslint:disable-next-line: no-string-literal
    defaultViewType: ViewType = this.configDefaults.viewType
  ): ViewConfiguration {
    return new ViewConfiguration({
      dateType: configDate === undefined ? defaultDateType : configDate,
      viewType: configView === undefined ? defaultViewType : configView,
    });
  }

  private convertStringToViewConfiguration(str: string): ViewConfiguration {
    const testString = str.toUpperCase();
    let vc: ViewConfiguration;

    if (testString in DateType) {
      vc = this.seedViewConfigurationWithEnum(DateType[testString]);
    } else if (testString in ViewType) {
      vc = this.seedViewConfigurationWithEnum(undefined, ViewType[testString]);
    } else {
      throw new Error(
        `: string ${str} not a valid member or DateType or ViewType.`
      );
    }

    return vc;
  }
}
