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

  selectValue(index: number, value: string): boolean {
    if (this.currentSet !== index) {
      this.currentSet = index;
      index === 0 ? this.updateView(this.amArr) : this.updateView(this.pmArr);
    }
    return true;
  }

  updateView(array: AtomicDateObject[], frameElement = this.frameElement) {
    if (this.virtualDom) {
      // DatePickerBaseView has determined that a virtualDom is needed
      this.virtualDom.buildView(array, frameElement);
      return;
    }

    this.buildDateView(array);
  }

  append(parentElement: HTMLElement): void {
    // attach switch
    this.amPmToggleSwitch.append(parentElement);
    this.initFrameView();
    this.frameElement.className = this.appendClassName('');
    parentElement.append(this.frameElement);
    this.populateView();
  }

  populateView(
    model: DatePickerFactory = this.model,
    frameElement: HTMLElement = this.frameElement
  ) {
    const array = model.dateArray(24);
    this.amArr = array.slice(0, 12);
    this.pmArr = array.slice(12);
    this.updateView(this.amArr, frameElement);
  }
}
