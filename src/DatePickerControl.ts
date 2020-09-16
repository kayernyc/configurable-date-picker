import DatePickerModel from './models/DatePickerModel';
import DatePickerFactory from './models/datePickerFactory/DatePickerFactory';
import DatePickerBaseView from './views/DatePickerBaseView';
import DatePickerListView from './views/DatePickerListView';
import ViewConfiguration from './enums/ViewConfiguration';
import ViewConfigurationAdapter from './models/ViewConfigurationAdapter';

import CalendarView from './views/CalendarView';
import DateView from './views/DateView';
import DateType from './enums/DateType';
import Hour12View from './views/Hour12View';
import Hour24View from './views/Hour24View';
import MonthGridView from './views/MonthGridView';
import YearsView from './views/YearsViews';

import ViewType from './enums/ViewType';
import WeekView from './views/WeekView';

const dateTypeDefaultLooping = {
  [DateType.CALENDAR]: false,
  [DateType.DATE]: false,
  [DateType.DAY]: true,
  [DateType.HOUR]: true,
  [DateType.HOUR24]: true,
  [DateType.MONTH]: true,
  [DateType.WEEK]: true,
  [DateType.YEAR]: false
}

const dateTypeDefaultContinuous = {
  [DateType.CALENDAR]: true,
  [DateType.DATE]: true,
  [DateType.DAY]: true,
  [DateType.HOUR]: true,
  [DateType.HOUR24]: true,
  [DateType.MONTH]: false,
  [DateType.WEEK]: false,
  [DateType.YEAR]: true
}

export default class DatePickerControl {
  datePickerModel: DatePickerModel;

  private viewOpenState = false;
  private viewContainer: HTMLElement;
  private viewConfigurations: ViewConfiguration[];
  private views: DatePickerBaseView[];

  private vcAdapter: ViewConfigurationAdapter = new ViewConfigurationAdapter();

  constructor(
    model: DatePickerModel,
    viewContainer: HTMLElement,
    viewConfigurations: any[] | string,
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
    return { looping: dateTypeDefaultLooping[dateType], continuousScroll: dateTypeDefaultContinuous[dateType], ...config }
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
      let view: DatePickerBaseView;

      switch (true) {
        case dateType === DateType.WEEK && viewType === ViewType.LIST:
        case dateType === DateType.WEEK && viewType === ViewType.GRID:
          if (looping) {
            if (continuousScroll) {
              console.warn('For week views, looping and continuous scrolling are incompatible. Week will fall back to non-continuous looping');
            }
            viewConfiguration.continuousScroll = false;
          }

          view = new WeekView(viewModel, viewConfiguration, (viewType === ViewType.GRID ? true : false));
          break;

        case dateType === DateType.YEAR && viewType === ViewType.LIST:
        case dateType === DateType.YEAR && viewType === ViewType.GRID:
          // Looping is not possible with years until date ranges are implemented.
          view = new YearsView(viewModel, viewConfiguration, (viewType === ViewType.GRID ? true : false));
          break;

        case dateType === DateType.HOUR && viewType === ViewType.LIST:
        case dateType === DateType.HOUR && viewType === ViewType.GRID:
          view = new Hour12View(viewModel);
          break;

        case dateType === DateType.HOUR24 && viewType === ViewType.LIST:
        case dateType === DateType.HOUR24 && viewType === ViewType.GRID:
          view = new Hour24View(viewModel);
          break;

        case dateType === DateType.DATE && viewType === ViewType.GRID:
        case dateType === DateType.DATE && viewType === ViewType.LIST:
          view = new DateView(viewModel);
          break;

        case dateType === DateType.MONTH && viewType === ViewType.GRID:
          view = new MonthGridView(viewModel);
          break;

        case dateType === DateType.CALENDAR && viewType === ViewType.LIST:
        case dateType === DateType.CALENDAR && viewType === ViewType.GRID:
          view = new CalendarView(viewModel);
          break;

        default:
          view = new DatePickerListView(viewModel);
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
