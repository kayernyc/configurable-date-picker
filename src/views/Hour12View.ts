/**
 * Owns both the top nav (AM/PM) and the list
 */

import AtomicDateObject from '../models/AtomicDateObject';
import DatePickerBaseView from './DatePickerBaseView';
import DatePickerFactory from '../models/datePickerFactory/DatePickerFactory';
import ToggleView, { ToggleSwitchProxy } from './uicomponents/ToggleSwitch';
import ViewConfiguration from '../enums/ViewConfiguration';

export default class Hour12View extends DatePickerBaseView
  implements ToggleSwitchProxy {
  continuousScroll: boolean;
  currentSet: number;
  amArr: AtomicDateObject[];
  pmArr: AtomicDateObject[];

  amPmToggleSwitch: ToggleView;

  constructor(model: DatePickerFactory, viewConfiguration: ViewConfiguration) {
    const { continuousScroll, looping } = viewConfiguration
    super(model, continuousScroll, looping);
    this.amPmToggleSwitch = new ToggleView(['AM', 'PM']);
    this.amPmToggleSwitch.proxy = this;
    this.frameElementClassName = 'date-picker-list';
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
