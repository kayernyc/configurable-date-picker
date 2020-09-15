/**
 * Weeks (S, M, T, W, T, F, S) in a grid or list
 * Can be continuousScroll or limited
 */

import AtomicDateObject from '../models/AtomicDateObject';
import DatePickerFactory from '../models/datePickerFactory/DatePickerFactory';
import DatePickerView from './DatePickerViewInterface';
import DatePickerBaseView from './DatePickerBaseView';
import ViewConfiguration from '../enums/ViewConfiguration';

export default class WeekView extends DatePickerBaseView
  implements DatePickerView {
  continuousScroll: boolean;

  constructor(model: DatePickerFactory, viewConfiguration: ViewConfiguration, grid: boolean) {
    let continuousScroll = true;

    if (viewConfiguration.looping === true || viewConfiguration.continuousScroll === undefined) {
      continuousScroll = false
    }

    super(model, continuousScroll, viewConfiguration.looping);
    this.continuousScroll = continuousScroll;
    grid ? this.frameElementClassName = 'date-picker-grid' : this.frameElementClassName = 'date-picker-list';
  }

  buildDateView(
    atomicDateObjectArray: AtomicDateObject[],
    frameElement: HTMLElement = this.frameElement
  ): void {
    atomicDateObjectArray.forEach((date: AtomicDateObject) => {
      const element = document.createElement('div');
      element.innerHTML = date.viewString;
      frameElement.append(element);
    });
  }

  updateView(array: AtomicDateObject[], frameElement = this.frameElement): void {
    if (this.virtualDom) {
      // DatePickerBaseView has determined that a virtualDom is needed
      console.log('VIR')
      this.virtualDom.buildView(array, frameElement);
      return;
    }

    this.buildDateView(array);
  }

  populateView(
    model: DatePickerFactory = this.model,
    frameElement: HTMLElement = this.frameElement
  ): void {
    const array = model.dateArray(7);
    if (this.continuousScroll) {
      array.unshift(this.model.getAtomicDateObjectByIndex(-1)[0])
      array.unshift(this.model.getAtomicDateObjectByIndex(-2)[0])
    }

    if (this.virtualDom) {
      // DatePickerBaseView has determined that a virtualDom is needed
      this.virtualDom.buildView(array, frameElement);
      return
    }

    this.buildDateView(array);
  }
}
