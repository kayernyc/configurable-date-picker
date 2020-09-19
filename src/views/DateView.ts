/**
 * Owns both the top nav (AM/PM) and the list
 */

import AtomicDateObject from '../models/AtomicDateObject';
import DatePickerFactory from '../models/datePickerFactory/DatePickerFactory';
import ViewConfiguration from '../enums/ViewConfiguration';
import DatePickerBaseView from './DatePickerBaseView';

export default class DateView extends DatePickerBaseView {
  continuousScroll: boolean;

  constructor(model: DatePickerFactory, viewConfiguration: ViewConfiguration) {
    const { continuousScroll } = viewConfiguration
    super(model, continuousScroll);
    this.frameElementClassName = 'date-picker-list';
  }

  updateView(array: AtomicDateObject[], frameElement = this.frameElement): void {
    if (this.virtualDom) {
      // DatePickerBaseView has determined that a virtualDom is needed
      this.virtualDom.buildView(array, frameElement);
      return;
    }

    this.buildDateView(array);
  }

  append(parentElement: HTMLElement): void {
    this.initFrameView(true);
    this.frameElement.className = this.appendClassName('');
    parentElement.append(this.frameElement);
    this.populateView();
    this.populateView()
  }

  populateView(
    model: DatePickerFactory = this.model,
    frameElement: HTMLElement = this.frameElement
  ): void {
    const array = model.dateArray(3);
    this.updateView(array, frameElement);
  }
}
