/**
 * Owns both the top nav (AM/PM) and the list
 */

import AtomicDateObject from "../models/AtomicDateObject";
import DatePickerFactory from "../models/datePickerFactory/DatePickerFactory";
import DatePickerListView from "./DatePickerListView";

export default class Hour24View extends DatePickerListView {
  continuousScroll: boolean;

  constructor(
    model: DatePickerFactory,
    continuousScroll = true,
  ) {
    super(model, continuousScroll);
  }

  populateView(
    model: DatePickerFactory = this.model,
    frameElement: HTMLElement = this.frameElement
  ) {
    const arr = model.dateArray(24);
    if (this.virtualDom) {
      console.log({arr, frameElement})
      // DatePickerBaseView has determined that a virtualDom is needed
      this.virtualDom.buildView(arr, frameElement);
      return;
    }

    this.buildDateView(arr);
  }
}
