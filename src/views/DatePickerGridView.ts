import DatePickerBaseView from "./DatePickerBaseView";
import DatePickerView from "./DatePickerViewInterface";
import DatePickerFactory from "../models/DatePickerFactory";

export default class DatePickerGridView extends DatePickerBaseView
  implements DatePickerView {
  continuousScroll = false;

  constructor(model: DatePickerFactory, continuousScroll = false) {
    super(model, continuousScroll);
    this.frameElementClassName = "date-picker-grid";
  }

  protected populateView(
    model: DatePickerFactory,
    containerView: HTMLElement,
    frameElement: HTMLElement
  ) {
    throw new Error("Override populateView");
  }
}
