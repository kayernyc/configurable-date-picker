/**
 * Owns both the top nav (AM/PM) and the list
 */

import AtomicDateObject from '../models/AtomicDateObject';
import DatePickerFactory from '../models/datePickerFactory/DatePickerFactory';
import DatePickerListView from './DatePickerListView';
import WeekDateObject from '../models/WeekDateObject';

export default class CalendarView extends DatePickerListView {
  continuousScroll: boolean;

  constructor(model: DatePickerFactory, continuousScroll = true) {
    super(model, continuousScroll);
  }

  updateView(array: AtomicDateObject[], frameElement = this.frameElement): void {
    if (this.virtualDom) {
      this.virtualDom.buildView(array, frameElement, undefined, 'calendar');
      return;
    }

    this.buildDateView(array as WeekDateObject[]);
  }

  buildDateView(weeksArray: WeekDateObject[], frameElement: HTMLElement = this.frameElement): void {
    weeksArray.forEach(week => {
      frameElement.innerHTML += week.viewString;
    })
  }

  append(parentElement: HTMLElement): void {
    this.initFrameView();

    this.frameElement.className = this.appendClassName('');
    parentElement.append(this.frameElement);
    this.populateView();
  }

  populateView(
    model: DatePickerFactory = this.model,
    frameElement: HTMLElement = this.frameElement
  ): void {
    const array = model.dateArray(3);
    this.updateView(array, frameElement);
  }
}
