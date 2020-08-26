/**
 * Owns both the top nav (AM/PM) and the list
 */

import AtomicDateObject from "../models/AtomicDateObject";
import DatePickerFactory from "../models/datePickerFactory/DatePickerFactory";
import DatePickerListView from "./DatePickerListView";

export default class CalendarView extends DatePickerListView {
  continuousScroll: boolean;

  constructor(model: DatePickerFactory, continuousScroll = false) {
    super(model, continuousScroll);
  }

  updateView(arr: AtomicDateObject[], frameElement = this.frameElement) {
    if (this.virtualDom) {
      // DatePickerBaseView has determined that a virtualDom is needed
      this.virtualDom.buildView(arr, frameElement);
      return;
    }

    this.buildDateView(arr);
  }

  append (parentElement: HTMLElement): void {
    this.initFrameView();
    this.frameElement.className = this.appendClassName("calendar");
    parentElement.appendChild(this.frameElement);
    this.populateView();
  }

  populateView(
    model: DatePickerFactory = this.model,
    frameElement: HTMLElement = this.frameElement
  ) {
    const arr = model.dateArray(3);
    this.updateView(arr, frameElement);
  }
}
