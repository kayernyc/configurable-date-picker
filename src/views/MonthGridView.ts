/**
 * Only months in a grid
 */

import DatePickerFactory from "../models/datePickerFactory/DatePickerFactory";
import DatePickerGridView from "./DatePickerGridView";
import DatePickerView from "./DatePickerViewInterface";

import VirtualDom from "./VirtualDom";

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
    this.frameElement = this.initFrameView(this.continuousScroll);
    this.frameElement.className += " date-picker-grid";
    parentElement.appendChild(this.frameElement)
    this.populateView()
  }

  populateView(
    model: DatePickerFactory = this.model,
    frameElement: HTMLElement = this.frameElement
  ) {
    const arr = model.dateArray(12);

    if (this.virtualDom) {
      // DatePickerBaseView has determined that a virtualDom is needed
      this.virtualDom.buildView(arr, frameElement);
      return
    }

    this.buildDateView(arr);
  }
}
