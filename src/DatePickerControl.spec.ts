import DatePickerControl from './DatePickerControl';
import DatePickerModel from './models/DatePickerModel';
import DateType from './enums/DateType';
import ViewType from './enums/ViewType';
import ViewConfiguration from './enums/ViewConfiguration';

/* tslint:disable */
import ContinuousScrollHandler from './views/virtualDom/ContinuousScrollHandler'
jest.mock('./views/virtualDom/ContinuousScrollHandler');

const seedViewConfiguration: ViewConfiguration = {
  initialCount: 1,
  dateType: DateType.CALENDAR,
  viewType: ViewType.LIST,
};

class ViewConfigurationAdapter {
  configDefaults: ViewConfiguration;

  constructor(configDefaults: ViewConfiguration) {
    this.configDefaults = configDefaults;
  }

  sanitizeConfigObj(configObject: any): ViewConfiguration[] {
    return [this.configDefaults];
  }
}

const createDatePickerControl = (): DatePickerControl => {
  const model = new DatePickerModel();
  const element = document.createElement('div');
  element.style.height = '50px'
  return new DatePickerControl(model, element, 'hour');
}

describe('DatePickerControl', () => {
  it('exists', () => {
    const datePickerControl = createDatePickerControl()
    expect(datePickerControl).toBeTruthy();
  });
});

describe('DatePickerControl functions', () => {
  it('should call open or close', () => {
    const handleCloseSpy = jest.spyOn(
      DatePickerControl.prototype as any,
      'closeView'
    );
    const handleOpenSpy = jest.spyOn(
      DatePickerControl.prototype as any,
      'openView'
    );
    const datePickerControl = createDatePickerControl();
    datePickerControl.toggleView(true);
    expect(handleOpenSpy).toHaveBeenCalled();
    datePickerControl.toggleView(false);
    expect(handleCloseSpy).toHaveBeenCalled();
  });
});
