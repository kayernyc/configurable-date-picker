import ViewConfiguration from "../enums/ViewConfiguration";
import ViewType from "../enums/ViewType";
import DateType from "../enums/DateType";

const seedViewConfiguration: ViewConfiguration = {
  dateType: DateType.CALENDAR,
  viewType: ViewType.LIST,
}

export default class ViewConfigurationAdapter {
  configDefaults: ViewConfiguration

  constructor(configDefaults: ViewConfiguration = seedViewConfiguration) {
    this.configDefaults = configDefaults
  }

  sanitizeConfigObj(configObj: any): ViewConfiguration[] {
    // convert all incoming to valid configObj arrays

    switch (true) {
      case configObj instanceof ViewConfiguration:
        return [configObj];
      case Array.isArray(configObj):
        return configObj.reduce((acc: ViewConfiguration[], obj: any) => {
          return [...acc, ...this.sanitizeConfigObj(obj)];
        }, []);
      case typeof configObj === "string":
        const vC = this.convertStringToViewConfiguration(configObj);
        console.log('from string converter', vC)
        return [vC];
      default:
        throw new Error(
          `: ${JSON.stringify(
            configObj
          )} is not an acceptable configuration parameter.`
        );
    }
  }

  private seedViewConfigurationWithEnum(
    configDate?: DateType,
    configView?: ViewType,
    defaultDateType: DateType = this.configDefaults.dateType,
    defaultViewType: ViewType = this.configDefaults.viewType
  ): ViewConfiguration {
    return new ViewConfiguration({
      dateType: (configDate === undefined ? defaultDateType : configDate),
      viewType: (configView === undefined ? defaultViewType : configView),
    });
  }

  private convertStringToViewConfiguration(str: String): ViewConfiguration {
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
