/**
 * Owns both the top nav (AM/PM) and the list
 */

import AtomicDateObject from "../models/AtomicDateObject";
import DatePickerFactory from "../models/datePickerFactory/DatePickerFactory";
import DatePickerListView from "./DatePickerListView";
import WeekDateObject from "../models/WeekDateObject";

export default class CalendarView extends DatePickerListView {
  continuousScroll: boolean;

  constructor(model: DatePickerFactory, continuousScroll = true) {
    super(model, continuousScroll);
  }

  updateView(arr: AtomicDateObject[], frameElement = this.frameElement) {
    if (this.virtualDom) {
      this.virtualDom.buildView(arr, frameElement, undefined, 'calendar');
      return;
    }

    this.buildDateView(arr as WeekDateObject[]);
  }

  buildDateView(weeksArray: WeekDateObject[], frameElement: HTMLElement = this.frameElement) {
    weeksArray.forEach(week => {
      frameElement.innerHTML += week.viewString
    })
  }

  append(parentElement: HTMLElement): void {
    this.initFrameView();

    this.frameElement.className = this.appendClassName("");
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
