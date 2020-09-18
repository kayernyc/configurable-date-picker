/**
 * Only months in a grid
 */

import DatePickerFactory from '../models/datePickerFactory/DatePickerFactory';
import DatePickerGridView from './DatePickerGridView';
import DatePickerView from './DatePickerViewInterface';
import WeekDateObject from '../models/WeekDateObject';
import ViewConfiguration from '../enums/ViewConfiguration';

export default class MonthGridView extends DatePickerGridView
  implements DatePickerView {

  constructor(
    model: DatePickerFactory,
    viewConfiguration: ViewConfiguration
  ) {
    const { continuousScroll } = viewConfiguration
    super(model, continuousScroll);
  }

  updateView(array: WeekDateObject[], frameElement = this.frameElement): void {
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
    const array = model.dateArray(12);

    if (this.virtualDom) {
      // DatePickerBaseView has determined that a virtualDom is needed
      this.virtualDom.buildView(array, frameElement);
      return
    }

    this.buildDateView(array);
  }
}
