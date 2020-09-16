/**
 * Only years
 */

import AtomicDateObject from '../models/AtomicDateObject';
import DatePickerFactory from '../models/datePickerFactory/DatePickerFactory';
import DatePickerView from './DatePickerViewInterface';
import ViewConfiguration from '../enums/ViewConfiguration';
import DatePickerBaseView from './DatePickerBaseView';

export default class YearsView extends DatePickerBaseView implements DatePickerView {

  constructor(model: DatePickerFactory, viewConfiguration: ViewConfiguration, grid: boolean) {
    const continuousScroll = true;

    // Until date ranges are implemented, looping is not possible with years.
    // if (viewConfiguration.looping === true || viewConfiguration.continuousScroll === undefined) {
    //   continuousScroll = false
    // }
    super(model, continuousScroll);

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

  protected populateView(
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
