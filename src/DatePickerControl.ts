import DatePickerModel from "./DatePickerModel";
import { DateType } from "./model/DateType";
import { ViewType } from "./model/ViewType";
import DatePickerType from "./model/DatePickerType";

export default class DatePickerControl {
  datePickerModel: DatePickerModel;

  private viewOpenState: Boolean = false;
  private viewContainer: HTMLElement;
  private views: DatePickerType[];

  constructor(
    model: DatePickerModel,
    viewContainer: HTMLElement,
    views: string[],
    open = true
  ) {
    this.datePickerModel = model;
    this.viewContainer = viewContainer;
    let viewTypes = this.sanitizeViewTypesArray(views);
    this.views = this.viewTypes(viewTypes);

    this.initViewContainer(viewContainer, this.views);
    this.toggleView(open);
  }

  private initViewContainer(container: HTMLElement, views: DatePickerType[]) {
    container.className = "date-picker";
    views.forEach((view:DatePickerType) => {
      container.appendChild(view.viewContainer)
    })
  }

  // Container

  private openView() {
    this.viewContainer.className = "date-picker date-picker-open";
  }

  private closeView() {
    this.viewContainer.className = "date-picker date-picker-close";
  }

  // Views

  private viewTypes(views: DateType[]): DatePickerType[] {
    return views.map((viewType: DateType) => {
      const dpt = new DatePickerType(viewType, ViewType.LIST);
      dpt.selectionView();
      return dpt;
    });
  }

  private sanitizeViewTypesArray(views: string[]): DateType[] {
    return views.map((viewString: string) => {
      viewString = viewString.toUpperCase();
      return DateType[viewString];
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
