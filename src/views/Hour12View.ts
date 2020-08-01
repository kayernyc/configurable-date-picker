
/**
 * Owns both the top nav (AM/PM) and the list
 */

import DatePickerFactory from "../models/DatePickerFactory";
import DatePickerListView from "./DatePickerListView";
import DatePickerView from "./DatePickerViewInterface";

import VirtualDom from "./VirtualDom";

export default class Hour12View extends DatePickerListView
  implements DatePickerView {
  continuousScroll: Boolean;
  virtualDom: VirtualDom

  constructor(model: DatePickerFactory, continuousScroll = true) {
    super(model, (continuousScroll = true));

    if (this.virtualDom) {
      // DatePickerBaseView determines if a virtualDom is needed
      this.buildDateView = this.virtualDom.buildView.bind(this.virtualDom)
    }

    this.populateView()
  }

  populateView(
    model: DatePickerFactory = this.model,
    frameElement: HTMLElement = this.frameElement
  ) {
    const arr = model.dateArray(12);
    this.buildDateView(arr);
  }
}
