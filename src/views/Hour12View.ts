/**
 * Owns both the top nav (AM/PM) and the list
 */

import DatePickerFactory from "../models/datePickerFactory/DatePickerFactory";
import DatePickerListView from "./DatePickerListView";
import DatePickerView from "./DatePickerViewInterface";
import ToggleView, { ToggleSwitchProxy } from "./uicomponents/ToggleSwitch";

import VirtualDom from "./virtualDom/VirtualDom";

export default class Hour12View extends DatePickerListView
  implements ToggleSwitchProxy {
  continuousScroll: boolean;
  currentSet: number = 0;

  amPmToggleSwitch: ToggleView = new ToggleView(["AM", "PM"]);

  constructor(
    model: DatePickerFactory,
    continuousScroll = true,
    looping = true
  ) {
    super(model, continuousScroll);
    this.amPmToggleSwitch.proxy = this;
  }

  selectValue(index: number, value: string): boolean {
    if (this.currentSet !== index) {
      this.currentSet = index;
    }
    return true;
  }

  append(parentElement: HTMLElement): void {
    // attach switch
    this.amPmToggleSwitch.append(parentElement);
    this.frameElement = this.initFrameView(this.continuousScroll);
    this.frameElement.className += " date-picker-list";
    parentElement.appendChild(this.frameElement);
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
      return;
    }

    this.buildDateView(arr);
  }
}
