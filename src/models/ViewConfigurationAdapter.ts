import ViewConfiguration from "../enums/ViewConfiguration";
import ViewType from "../enums/ViewType";
import DateType from "../enums/DateType";

const seedViewConfiguration: ViewConfiguration = {
  dateType: DateType.CALENDAR,
  viewType: ViewType.LIST,
};

export default class ViewConfigurationAdapter {
  configDefaults: ViewConfiguration;

  constructor(configDefaults: ViewConfiguration = seedViewConfiguration) {
    this.configDefaults = configDefaults;
  }

  sanitizeConfigObj(configObj: any): ViewConfiguration[] {
    // convert all incoming to valid configObj arrays

    switch (true) {
      case this.matchObjectToViewConfiguration(configObj):
        return [configObj];

      case Array.isArray(configObj):
        const arrCandidate: ViewConfiguration[] = configObj.reduce(
          (acc: ViewConfiguration[], obj: any) => {
            return [...acc, ...this.sanitizeConfigObj(obj)];
          },
          []
        );
        if (arrCandidate.length < 1) {
          throw new Error(
            `: ${JSON.stringify(
              configObj
            )} is not an acceptable configuration parameter.`
          );
        }

        return arrCandidate;

      case typeof configObj === "string":
        const vC = this.convertStringToViewConfiguration(configObj);
        return [vC];
      default:
        throw new Error(
          `: ${JSON.stringify(
            configObj
          )} is not an acceptable configuration parameter.`
        );
    }
  }

  // TODO: Abstract and move to utilities

  matchObjectToViewConfiguration(obj: ViewConfiguration): boolean {
    const objKeys = Object.keys(obj);
    const vCKeys = ["dateType", "viewType"];

    const keysMissing = vCKeys.some((key) => {
      return !objKeys.includes(key);
    });

    if (keysMissing) {
      return false;
    }

    if (
      // tslint:disable: no-string-literal
      obj["dateType"] !== undefined &&
      [0, 1, 2, 3, 4, 5, 6, 7].includes(obj["dateType"]) &&
      obj["viewType"] !== undefined &&
      [0, 1, 2, 3, 4, 5, 6, 7].includes(obj["viewType"])
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
    defaultViewType: ViewType = this.configDefaults["viewType"]
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
