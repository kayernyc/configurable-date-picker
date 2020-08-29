/**
 * Only months in a grid
 */

import DatePickerFactory from '../models/datePickerFactory/DatePickerFactory';
import DatePickerGridView from './DatePickerGridView';
import DatePickerView from './DatePickerViewInterface';

export default class MonthGridView extends DatePickerGridView
  implements DatePickerView {
  continuousScroll: boolean;

  constructor(model: DatePickerFactory, continuousScroll = true) {
    super(model, (continuousScroll = true));

    if (this.virtualDom) {
      // DatePickerBaseView determines if a virtualDom is needed
      this.buildDateView = this.virtualDom.buildView.bind(this.virtualDom)
    }
  }

  append (parentElement: HTMLElement): void {
    this.initFrameView();
    this.frameElement.className += ' date-picker-grid';
    parentElement.append(this.frameElement)
    this.populateView()
  }

  populateView(
    model: DatePickerFactory = this.model,
    frameElement: HTMLElement = this.frameElement
  ) {
    const array = model.dateArray(12);

    if (this.virtualDom) {
      // DatePickerBaseView has determined that a virtualDom is needed
      this.virtualDom.buildView(array, frameElement);
      return
    }

    this.buildDateView(array);
  }
}
