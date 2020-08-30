/**
 * Owns both the top nav (AM/PM) and the list
 */

import AtomicDateObject from '../models/AtomicDateObject';
import DatePickerFactory from '../models/datePickerFactory/DatePickerFactory';
import DatePickerListView from './DatePickerListView';
import ToggleView, { ToggleSwitchProxy } from './uicomponents/ToggleSwitch';

export default class Hour12View extends DatePickerListView
  implements ToggleSwitchProxy {
  continuousScroll: boolean;
  currentSet = 0;
  amArr: AtomicDateObject[];
  pmArr: AtomicDateObject[];

  amPmToggleSwitch: ToggleView = new ToggleView(['AM', 'PM']);

  constructor(model: DatePickerFactory, continuousScroll = true) {
    super(model, continuousScroll);
    this.amPmToggleSwitch.proxy = this;
  }

  selectValue(index: number): boolean {
    if (this.currentSet !== index) {
      this.currentSet = index;
      index === 0 ? this.updateView(this.amArr) : this.updateView(this.pmArr);
    }
    return true;
  }

  updateView(adoArray: AtomicDateObject[], frameElement = this.frameElement): void {
    if (this.virtualDom) {
      // DatePickerBaseView has determined that a virtualDom is needed
      this.virtualDom.buildView(adoArray, frameElement);
      return;
    }

    this.buildDateView(adoArray);
  }

  append(parentElement: HTMLElement): void {
    // attach switch
    this.amPmToggleSwitch.append(parentElement);
    this.initFrameView(true);
    this.frameElement.className = this.appendClassName("");
    parentElement.append(this.frameElement);
    this.populateView();
  }

  populateView(
    model: DatePickerFactory = this.model,
    frameElement: HTMLElement = this.frameElement
  ): void {
    const adoArray = model.dateArray(24);
    this.amArr = adoArray.slice(0, 12);
    this.pmArr = adoArray.slice(12);
    this.updateView(this.amArr, frameElement);
  }
}
