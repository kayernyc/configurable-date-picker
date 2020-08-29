import DatePickerModel from './models/DatePickerModel';
import DatePickerFactory from './models/datePickerFactory/DatePickerFactory';
import DatePickerBaseView from './views/DatePickerBaseView';
import DatePickerListView from './views/DatePickerListView';
import ViewConfiguration from './enums/ViewConfiguration';
import ViewConfigurationAdapter from './models/ViewConfigurationAdapter';
import DateView from './views/DateView';
import DateType from './enums/DateType';
import Hour12View from './views/Hour12View';
import Hour24View from './views/Hour24View';
import MonthGridView from './views/MonthGridView';
import ViewType from './enums/ViewType';
import CalendarView from './views/CalendarView';

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

  // Container - do this with CSS later
  private openView() {
    this.viewContainer.className = 'date-picker date-picker-open';
  }

  private closeView() {
    this.viewContainer.className = 'date-picker date-picker-close';
  }

  // // generic enum type sanitizer - move to static utilities
  // private sanitizeTypeArray = <T>(arr: string[], expectedEnum: T): any[] => {
  //   // TODO all strings should be properly cased before they get here.
  //   return arr
  //     .map((caseString: string) => caseString.toUpperCase())
  //     .filter((caseString: string) => caseString in expectedEnum)
  //     .map((caseString: string) => expectedEnum[caseString]);
  // };

  // Views - create factory injectable
  private initViewContainer(
    container: HTMLElement,
    viewConfigurations: ViewConfiguration[]
  ): DatePickerBaseView[] {
    container.className = 'date-picker';

    return viewConfigurations.map((viewConfiguration: ViewConfiguration) => {
      const { dateType, viewType } = viewConfiguration;
      const viewModel = new DatePickerFactory(viewConfiguration);
      let view: DatePickerBaseView;

      switch (true) {
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
  // tslint:disable-next-line: no-empty
  updateViews(views: string[]): void { }

  toggleView(desiredState: boolean): boolean {
    if (desiredState !== this.viewOpenState) {
      desiredState ? this.openView() : this.closeView();
    }

    this.viewOpenState = desiredState;
    return this.viewOpenState;
  }
}
