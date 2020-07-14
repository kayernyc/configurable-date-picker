import { DateType } from "./DateType";
import { ViewType } from "./ViewType";

export default class DatePickerType {
  private type: DateType;
  private viewType: ViewType;
  private viewElement: HTMLElement

  constructor(type: DateType, viewType = ViewType.GRID) {
    this.type = type;
    this.viewType = viewType;
  }

  // Initialization
  private createViewContainer(viewType: ViewType): HTMLElement {
    const element = document.createElement("div");
    element.className =
      viewType === ViewType.GRID ? "date-picker-grid" : "date-picker-list";
    return element;
  }

  get viewContainer(): HTMLElement {
    if (this.viewElement === undefined) {
      this.viewElement = this.createViewContainer(this.viewType)
    }

    return this.viewElement
  }

  // API
  selectionView() {
    switch (this.type) {
      case DateType.DATE:
        console.log(`I am date`);
        break;
      case (DateType.DAY, DateType.WEEK):
        console.log(`I am day or week`);
        break;
      case DateType.HOUR:
        console.log(`I am hour`);
        break;
      case DateType.MONTH:
        console.log(`I am Month`);
        break;
      case DateType.YEAR:
        console.log("I am YEAR");
      default:
        console.log("I am Calendar");
    }
  }
}
