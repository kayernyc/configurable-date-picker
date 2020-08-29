/**
 * Owns both the top nav (AM/PM) and the list
 */

import AtomicDateObject from '../models/AtomicDateObject';
import DatePickerFactory from '../models/datePickerFactory/DatePickerFactory';
import DatePickerListView from './DatePickerListView';

export default class DateView extends DatePickerListView {
  continuousScroll: boolean;

  constructor(model: DatePickerFactory, continuousScroll = true) {
    super(model, continuousScroll);
  }

  updateView(array: AtomicDateObject[], frameElement = this.frameElement) {
    if (this.virtualDom) {
      // DatePickerBaseView has determined that a virtualDom is needed
      this.virtualDom.buildView(array, frameElement);
      return;
    }

    this.buildDateView(array);
  }

  append (parentElement: HTMLElement): void {
    this.initFrameView(true);
    this.frameElement.className = this.appendClassName('');
    parentElement.append(this.frameElement);
    this.populateView();
    this.populateView()
  }

  populateView(
    model: DatePickerFactory = this.model,
    frameElement: HTMLElement = this.frameElement
  ) {
    const array = model.dateArray(3);
    this.updateView(array, frameElement);
  }
}
