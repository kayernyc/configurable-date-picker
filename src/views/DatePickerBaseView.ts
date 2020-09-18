/*
 These views only present dates, not navigation
 */

import AtomicDateObject from '../models/AtomicDateObject';
import ContinuousScrollHandler from './virtualDom/ContinuousScrollHandler';
import DatePickerFactory from '../models/datePickerFactory/DatePickerFactory';
import VirtualDom from './virtualDom/VirtualDom';

export default abstract class DatePickerBaseView {
  continuousScroll: boolean;
  looping: boolean;

  protected frameElement: HTMLElement;
  protected frameElementClassName: string;
  protected model: DatePickerFactory;
  protected virtualDom: VirtualDom;

  constructor(model: DatePickerFactory, continuousScroll = true, looping = false) {
    this.continuousScroll = continuousScroll;
    this.looping = looping;
    this.model = model;

  }

  protected appendClassName(className: string): string {
    const classNames = className.split(' ');
    classNames.push(this.frameElementClassName);
    return classNames.join(' ');
  }

  /**
   * Triggered by append call.
   *
   * @param continuousScroll
   */
  protected initFrameView(continuousScroll = this.continuousScroll, looping = this.looping): HTMLElement {
    this.frameElement = document.createElement('div');

    if (continuousScroll) {
      // init ContinuousScrollHandler
      this.virtualDom = new VirtualDom(
        new ContinuousScrollHandler(this.model, looping)
      );
      this.frameElement.append(this.virtualDom.frameElement);
    }

    return this.frameElement;
  }

  append(parentElement: HTMLElement): void {
    this.frameElement = this.initFrameView(this.continuousScroll);
    this.frameElement.className = this.appendClassName(this.frameElement.className)
    parentElement.append(this.frameElement);

    if (this.populateView && typeof this.populateView === 'function') {
      this.populateView(this.model, this.frameElement);
    }
  }

  protected abstract populateView(
    model: DatePickerFactory,
    frameElement: HTMLElement
  ): void;

  /**
   * @param arr AtomicDateObject[]
   * @param atomicDateObjectArr
   * @param atomicDateObjectArray
   * @param frameElement
   *
   * When the list view does not continuously scroll
   * and has more than the dom limit, this function
   * appends the elements directly to the dom.
   */
  protected buildDateView(
    atomicDateObjectArray: AtomicDateObject[],
    frameElement: HTMLElement = this.frameElement
  ): void {
    atomicDateObjectArray.forEach((date: AtomicDateObject) => {
      const element = document.createElement('div');
      element.innerHTML = date.viewString;
      frameElement.append(element);
    });
  }

  get view(): HTMLElement {
    if (this.frameElement === undefined) {
      this.frameElement = this.initFrameView();
    }
    return this.frameElement;
  }
}
