import DatePickerModel from "./models/DatePickerModel";
import DatePickerFactory from "./models/DatePickerFactory";
import DatePickerBaseView from "./views/DatePickerBaseView";
import DatePickerListView from "./views/DatePickerListView";
import ViewConfiguration from "./enums/ViewConfiguration";
import ViewConfigurationAdapter from "./models/ViewConfigurationAdapter";
import Hour12View from "./views/Hour12View";

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
    const vcArr = this.vcAdapter.sanitizeConfigObj(viewConfigurations);

    this.views = this.initViewContainer(viewContainer, vcArr);
    this.toggleView(open);
  }

  // Container - do this with CSS later
  private openView() {
    this.viewContainer.className = "date-picker date-picker-open";
  }

  private closeView() {
    this.viewContainer.className = "date-picker date-picker-close";
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
    container.className = "date-picker";

    return viewConfigurations.map((viewConfiguration: ViewConfiguration) => {
      const {dateType, viewType} = viewConfiguration
      const viewModel = new DatePickerFactory(viewConfiguration)
      let view: DatePickerBaseView;
      // tslint:disable-next-line: no-console
      console.log(dateType, viewType)

      switch (dateType && viewType) {
        case (0 && 6):
          view = new Hour12View(viewModel);
          break;
        default:
          view = new DatePickerListView(viewModel)
      }
      // container.appendChild(view.view);
      view.append(container)
      return view;
    });
  }

  // API
  // tslint:disable-next-line: no-empty
  updateViews(views: string[]) {}

  toggleView(desiredState: boolean): boolean {
    if (desiredState !== this.viewOpenState) {
      desiredState ? this.openView() : this.closeView();
    }

    this.viewOpenState = desiredState;
    return this.viewOpenState;
  }
}
