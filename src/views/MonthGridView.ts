/**
 * Only months in a grid
 */

import DatePickerFactory from "../models/DatePickerFactory";
import DatePickerGridView from "./DatePickerGridView";
import DatePickerView from "./DatePickerViewInterface";

import VirtualDom from "./VirtualDom";

export default class MonthGridView extends DatePickerGridView
  implements DatePickerView {
  continuousScroll: boolean;
  virtualDom: VirtualDom

  constructor(model: DatePickerFactory, continuousScroll = true) {
    super(model, (continuousScroll = true));

    if (this.virtualDom) {
      // DatePickerBaseView determines if a virtualDom is needed
      this.buildDateView = this.virtualDom.buildView.bind(this.virtualDom)
    }

    this.populateView()
  }

  append (parentElement: HTMLElement): void {
    this.frameElement = this.initFrameView(this.continuousScroll);
    this.frameElement.className += " date-picker-list";
  }

  populateView(
    model: DatePickerFactory = this.model,
    frameElement: HTMLElement = this.frameElement
  ) {
    const arr = model.dateArray(12);
    this.buildDateView(arr);
  }
}
