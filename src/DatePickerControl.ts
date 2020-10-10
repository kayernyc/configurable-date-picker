import DatePickerModel from './models/DatePickerModel';
import DatePickerFactory from './models/datePickerFactory/DatePickerFactory';
import DatePickerBaseView from './views/DatePickerBaseView';
import ViewConfiguration, { ViewConfigurationHeader } from './enums/ViewConfiguration';
import ViewConfigurationAdapter from './models/ViewConfigurationAdapter';

import CalendarView from './views/CalendarView';
import DateType from './enums/DateType';
import Hour12View from './views/Hour12View';
import StandardView from './views/StandardView';
import WeekView from './views/WeekView';

import ViewHeader from './views/uicomponents/ViewHeader';

import ViewType from './enums/ViewType';
import DateSetterForm from './views/uicomponents/DateSetterForm';

const dateTypeDefaults: Record<DateType, [boolean, boolean, number]> = { // looping, continuousScroll, initialCount
  [DateType.CALENDAR]: [false, true, 3],
  [DateType.DATE]: [false, true, 3],
  [DateType.DAY]: [true, true, 3],
  [DateType.HOUR]: [true, true, 12],
  [DateType.HOUR24]: [true, true, 24],
  [DateType.MONTH]: [true, false, 12],
  [DateType.WEEK]: [true, false, 7],
  [DateType.YEAR]: [false, true, 10]
}

export default class DatePickerControl {
  datePickerModel: DatePickerModel;

  private viewOpenState = false;
  private viewContainer: HTMLElement;
  private viewConfigurations: ViewConfiguration[];
  private views: DatePickerBaseView[];

  private vcAdapter: ViewConfigurationAdapter = new ViewConfigurationAdapter();

  // Case functions
  static viewHeader(config: ViewConfigurationHeader): ViewHeader {
    let header: DateSetterForm;

    if (config.form) {
      header = new DateSetterForm(config.form)
    }
    return new ViewHeader(header)
  }

  constructor(
    model: DatePickerModel,
    viewContainer: HTMLElement,
    viewConfigurations: unknown[] | string,
    open = true
  ) {
    this.datePickerModel = model;
    this.viewContainer = viewContainer;

    // check that views are viewConfigurations
    const vcArray = this.vcAdapter.sanitizeConfigObj(viewConfigurations);

    this.views = this.initViewContainer(viewContainer, vcArray);
    this.toggleView(open);
  }

  private addDefaultsForLoopingAndContinuous = (config: ViewConfiguration): ViewConfiguration => {
    const { dateType } = config;
    const [looping, continuousScroll, initialCount] = dateTypeDefaults[dateType]
    return { looping, continuousScroll, initialCount, ...config }
  }

  // Container - do this with CSS later
  private openView() {
    this.viewContainer.className = 'date-picker date-picker-open';
  }

  private closeView() {
    this.viewContainer.className = 'date-picker date-picker-close';
  }

  // Views - create factory injectable
  private initViewContainer(
    container: HTMLElement,
    viewConfigurations: ViewConfiguration[]
  ): DatePickerBaseView[] {
    container.className = 'date-picker';

    return viewConfigurations.map((viewConfiguration: ViewConfiguration) => {
      viewConfiguration = this.addDefaultsForLoopingAndContinuous(viewConfiguration)
      const { dateType, viewType, looping, continuousScroll } = viewConfiguration;
      const viewModel = new DatePickerFactory(viewConfiguration);

      const grid = viewType === ViewType.GRID;
      let view: DatePickerBaseView;

      let viewHeader: ViewHeader;
      if (viewConfiguration.header) {
        viewHeader = DatePickerControl.viewHeader(viewConfiguration.header);
      }

      switch (true) {
        case dateType === DateType.CALENDAR:
          view = new CalendarView(viewModel, viewConfiguration, viewHeader);
          break;

        case dateType === DateType.DAY:
          if (looping) {
            if (continuousScroll) {
              console.warn('For day of week views, looping and continuous scrolling are incompatible. Day will fall back to non-continuous looping');
            }
            viewConfiguration.continuousScroll = false;
          }

          view = new WeekView(viewModel, viewConfiguration, grid);
          break;

        case dateType === DateType.HOUR:
          view = new Hour12View(viewModel, viewConfiguration);
          break;

        case dateType === DateType.WEEK:
          if (looping) {
            if (continuousScroll) {
              console.warn('For week views, looping and continuous scrolling are incompatible. Week will fall back to non-continuous looping');
            }
            viewConfiguration.continuousScroll = false;
          }

          view = new WeekView(viewModel, viewConfiguration, grid);
          break;

        case dateType === DateType.YEAR:
          // Looping is not possible with years until date ranges are implemented.
          view = new StandardView(viewModel, viewConfiguration, grid);
          break;

        default:
          view = new StandardView(viewModel, viewConfiguration, grid);

      }
      // container.appendChild(view.view);
      view.append(container);
      return view;
    });
  }

  // API
  updateViews(views: string[]): void {
    console.log(`deliberately empty ${views}`)
  }

  toggleView(desiredState: boolean): boolean {
    if (desiredState !== this.viewOpenState) {
      desiredState ? this.openView() : this.closeView();
    }

    this.viewOpenState = desiredState;
    return this.viewOpenState;
  }
}
