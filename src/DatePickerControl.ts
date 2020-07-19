import DatePickerModel from "./models/DatePickerModel";
import DateType from "./enums/DateType";
import DatePickerFactory from "./models/DatePickerFactory";
import DatePickerBaseView from "./views/DatePickerBaseView";
import DatePickerListView from "./views/DatePickerListView";
import ViewConfiguration from "./enums/ViewConfiguration";
import ViewConfigurationAdapter from "./models/ViewConfigurationAdapter";

export default class DatePickerControl {
  datePickerModel: DatePickerModel;

  private viewOpenState: Boolean = false;
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
    const bob = this.vcAdapter.sanitizeConfigObj(viewConfigurations);
    console.log(bob, "I AM BOB")

    this.views = this.initViewContainer(viewContainer, bob);
    // this.toggleView(open);
  }

  // Container - do this with CSS later
  private openView() {
    this.viewContainer.className = "date-picker date-picker-open";
  }

  private closeView() {
    this.viewContainer.className = "date-picker date-picker-close";
  }

  // generic enum type sanitizer - move to static utilities 
  private sanitizeTypeArray = <T>(arr: string[], expectedEnum: T): any[] => {
    // TODO all strings should be properly cased before they get here.
    return arr
      .map((caseString: string) => caseString.toUpperCase())
      .filter((caseString: string) => caseString in expectedEnum)
      .map((caseString: string) => expectedEnum[caseString]);
  };

  // Views - create factory injectable
  private initViewContainer(
    container: HTMLElement,
    viewConfigurations: ViewConfiguration[]
  ): DatePickerBaseView[] {
    container.className = "date-picker";
    
    return viewConfigurations.map((viewConfiguration: ViewConfiguration) => {
      const {viewType} = viewConfiguration
      const viewModel = new DatePickerFactory(viewConfiguration)

      const view = new DatePickerListView(viewModel);
      container.appendChild(view.view);
      return view;
    });
  }

  // API
  updateViews(views: string[]) {}

  toggleView(desiredState: Boolean): Boolean {
    if (desiredState !== this.viewOpenState) {
      // trigger view change
      desiredState ? this.openView() : this.closeView();
    }

    this.viewOpenState = desiredState;
    return this.viewOpenState;
  }
}
