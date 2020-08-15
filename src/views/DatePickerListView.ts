/**
 *  if continuous scroll is true or number of dates is more than 12 init virtual dom.
 *  if there is a virtual dom, then normal scrolling is disabled.
 */
import DatePickerFactory from "../models/DatePickerFactory";
import DatePickerBaseView from "./DatePickerBaseView";
import DatePickerView from "./DatePickerViewInterface";

export default class DatePickerListView extends DatePickerBaseView
  implements DatePickerView {

  constructor(model: DatePickerFactory, continuousScroll = true) {
    super(model, continuousScroll);
    this.frameElementClassName = "date-picker-list";
  }

  protected populateView(
    model: DatePickerFactory,
    containerView: HTMLElement,
    frameElement: HTMLElement
  ) {
    throw new Error("Override populateView");
  }
}
