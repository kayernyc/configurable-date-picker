/**
 * Owns both the top nav (AM/PM) and the list
 */

import AtomicDateObject from "../models/AtomicDateObject";
import DatePickerFactory from "../models/datePickerFactory/DatePickerFactory";
import DatePickerListView from "./DatePickerListView";

export default class DateView extends DatePickerListView {
  continuousScroll: boolean;

  constructor(model: DatePickerFactory, continuousScroll = true) {
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
    this.frameElement = this.initFrameView(this.continuousScroll);
    this.frameElement.className += "date-picker-view";
    const classNames = this.frameElement.className.split(" ");
    classNames.push(this.frameElementClassName);
    this.frameElement.className = classNames.join(" ");
    parentElement.appendChild(this.frameElement)
    this.populateView()
  }

  populateView(
    model: DatePickerFactory = this.model,
    frameElement: HTMLElement = this.frameElement
  ) {
    const arr = model.dateArray(3);
    console.log(`DATE arr ${arr}`);
    this.updateView(arr, frameElement);
  }
}
