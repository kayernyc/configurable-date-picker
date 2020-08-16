/**
 * Owns both the top nav (AM/PM) and the list
 */

import DatePickerFactory from "../models/datePickerFactory/DatePickerFactory";
import DatePickerListView from "./DatePickerListView";
import DatePickerView from "./DatePickerViewInterface";

import VirtualDom from "./virtualDom/VirtualDom";

export default class Hour12View extends DatePickerListView
  implements DatePickerView {
  continuousScroll: boolean;
  virtualDom: VirtualDom;

  constructor(model: DatePickerFactory, continuousScroll = true) {
    super(model, (continuousScroll = true));

    if (this.virtualDom) {
      // DatePickerBaseView determines if a virtualDom is needed
      this.buildDateView = this.virtualDom.buildView.bind(this.virtualDom)
    }
  }

  append(parentElement: HTMLElement): void {
    this.frameElement = this.initFrameView(this.continuousScroll);
    this.frameElement.className += " date-picker-list";
    parentElement.appendChild(this.frameElement)
    this.populateView();
  }

  populateView(
    model: DatePickerFactory = this.model,
    frameElement: HTMLElement = this.frameElement
  ) {
    const arr = model.dateArray(12);

    if (this.virtualDom) {
      // DatePickerBaseView has determined that a virtualDom is needed
      this.virtualDom.buildView(arr, this.frameElement);
      return
    }

    this.buildDateView(arr);
  }
}
