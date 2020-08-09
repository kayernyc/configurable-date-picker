/*
 These views only present dates, not navigation
 */

import ContinuousScrollHandler from "./virtualDom/ContinuousScrollHandler";
import DatePickerFactory from "../models/datePickerFactory/DatePickerFactory";
import VirtualDom from "./virtualDom/VirtualDom";

export default abstract class DatePickerBaseView {
  protected frameElement: HTMLElement;
  protected model: DatePickerFactory;
  protected virtualDom: VirtualDom;

  protected initFrameView(continuousScroll = true, looping = false): HTMLElement {
    this.frameElement = document.createElement("div");
    if (continuousScroll) {
      // init ContinuousScrollHandler
      this.virtualDom = new VirtualDom(new ContinuousScrollHandler(this.model))
      this.frameElement.appendChild(this.virtualDom.frameElement)
    }

    this.frameElement.className += " date-picker-view";
    return this.frameElement;
  }

  abstract append(parentElement: HTMLElement): void;

  get view (): HTMLElement {
    if (this.frameElement === undefined) {
      this.frameElement = this.initFrameView()
    }
    return this.frameElement
  }
}
