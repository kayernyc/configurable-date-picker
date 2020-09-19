/*
 These views only present dates, not navigation
 */

import AtomicDateObject from '../models/AtomicDateObject';
import ContinuousScrollHandler from './virtualDom/ContinuousScrollHandler';
import DatePickerFactory from '../models/datePickerFactory/DatePickerFactory';
import VirtualDom from './virtualDom/VirtualDom';
import WeekDateObject from '../models/WeekDateObject';

import { addElement, DATA_TAG_STRING, DateElementHandlerFunction } from './virtualDom/VirtualDomConst';

export default abstract class DatePickerBaseView {
  protected adoArray?: AtomicDateObject[] | WeekDateObject[]
  protected continuousScroll: boolean;
  protected frameElement: HTMLElement;
  protected frameElementClassName: string;
  protected looping: boolean;
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

    if (continuousScroll || looping) {
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

  protected dateElementHandlerFunction: DateElementHandlerFunction = (event: MouseEvent) => {
    if (this.adoArray) {
      const element: HTMLElement = event.target as HTMLElement;
      const dataTag = element.getAttribute(DATA_TAG_STRING);
      const ado = this.adoArray[dataTag] as AtomicDateObject
      console.log(ado.date)
    }
    return true;
  }

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
    atomicDateObjectArray.forEach((ado: AtomicDateObject, index: number) => {
      const element = addElement(ado, index, this.dateElementHandlerFunction);

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
