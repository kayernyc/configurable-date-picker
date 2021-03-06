/**
 * Weeks (S, M, T, W, T, F, S) in a grid or list
 * Can be continuousScroll or limited
 */

import AtomicDateObject from '../models/AtomicDateObject';
import DatePickerFactory from '../models/datePickerFactory/DatePickerFactory';
import DatePickerView from './DatePickerViewInterface';
import DatePickerBaseView from './DatePickerBaseView';
import ViewConfiguration from '../enums/ViewConfiguration';

export default class WeekView extends DatePickerBaseView
  implements DatePickerView {
  continuousScroll: boolean;

  constructor(model: DatePickerFactory, viewConfiguration: ViewConfiguration, grid: boolean) {
    const { continuousScroll, looping } = viewConfiguration;

    super(model, continuousScroll, looping);
    this.continuousScroll = continuousScroll;
    this.frameElementClassName = grid ? 'date-picker-grid' : 'date-picker-list';
  }

  updateView(array: AtomicDateObject[], frameElement = this.frameElement): void {
    if (this.virtualDom) {
      // DatePickerBaseView has determined that a virtualDom is needed
      this.virtualDom.buildView(array, frameElement);
      return;
    }

    this.buildDateView(array);
  }

  populateView(
    model: DatePickerFactory = this.model,
    frameElement: HTMLElement = this.frameElement
  ): void {
    const array = model.dateArray(7);
    if (this.continuousScroll) {
      array.unshift(this.model.getAtomicDateObjectByIndex(-1)[0])
      array.unshift(this.model.getAtomicDateObjectByIndex(-2)[0])
    }

    if (this.virtualDom) {
      // DatePickerBaseView has determined that a virtualDom is needed
      this.virtualDom.buildView(array, frameElement);
      return;
    }

    this.adoArray = array;
    this.buildDateView(array);
  }
}
