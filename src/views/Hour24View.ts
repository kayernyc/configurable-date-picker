/**
 * Owns both the top nav (AM/PM) and the list
 */

import AtomicDateObject from '../models/AtomicDateObject';
import DatePickerFactory from '../models/datePickerFactory/DatePickerFactory';
import DatePickerListView from './DatePickerListView';

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
    const array = model.dateArray(24);
    if (this.virtualDom) {
      // DatePickerBaseView has determined that a virtualDom is needed
      this.virtualDom.buildView(array, frameElement);
      return;
    }

    this.buildDateView(array);
  }
}
