/*
 These views only present dates, not navigation
 */

import DatePickerFactory from "../models/DatePickerFactory";
import VirtualDom from "./VirtualDom";

export default abstract class DatePickerBaseView {
  protected frameElement: HTMLElement;
  protected model: DatePickerFactory;
  protected virtualDom: VirtualDom;

  protected initFrameView(continuousScroll = true): HTMLElement {
    this.frameElement = document.createElement("div");

    if (continuousScroll) {
      this.virtualDom = new VirtualDom()
      this.frameElement.appendChild(this.virtualDom.frameElement)
    } else {
      
    }

    this.frameElement.className += " date-picker-view";
    return this.frameElement;
  }
  get view (): HTMLElement {
    if (this.frameElement === undefined) {
      this.frameElement = this.initFrameView()
    }
    return this.frameElement
  }
}
