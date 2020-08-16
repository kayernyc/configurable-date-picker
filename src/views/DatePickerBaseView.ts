/*
 These views only present dates, not navigation
 */
import AtomicDateObject from "../models/AtomicDateObject";
import DatePickerFactory from "../models/datePickerFactory/DatePickerFactory";
import VirtualDom from "./VirtualDom";

export default abstract class DatePickerBaseView {
  continuousScroll: boolean;

  protected frameElement: HTMLElement;
  protected frameElementClassName: string;
  protected model: DatePickerFactory;
  protected virtualDom: VirtualDom;

  constructor(model: DatePickerFactory, continuousScroll = true) {
    this.continuousScroll = continuousScroll;
    this.model = model;
  }

  protected initFrameView(continuousScroll = true): HTMLElement {
    this.frameElement = document.createElement("div");
    console.log("GRAND SUPER");
    if (continuousScroll) {
      this.virtualDom = new VirtualDom();
      this.frameElement.appendChild(this.virtualDom.frameElement);
      console.log("---- VIRTUAL DOM");
    } else {
      console.log("no virtual dom");
    }

    this.frameElement.className += " date-picker-view";
    return this.frameElement;
  }

  append(parentElement: HTMLElement): void {
    this.frameElement = this.initFrameView(this.continuousScroll);
    const classNames = this.frameElement.className.split("");
    classNames.push(this.frameElementClassName);
    this.frameElement.className = classNames.join(" ");
  }

  /**
   *
   * @param arr AtomicDateObject[]
   * @param frameElement HTMLElement
   *
   * When the list view does not continuously scroll
   * and has more than the dom limit, this function
   * appends the elements directly to the dom.
   */
  protected buildDateView(
    atomicDateObjectArr: AtomicDateObject[],
    frameElement: HTMLElement = this.frameElement
  ) {
    atomicDateObjectArr.forEach((date: AtomicDateObject) => {
      const el = document.createElement("div");
      el.innerHTML = date.viewString;
      frameElement.appendChild(el);
    });
  }

  get view(): HTMLElement {
    if (this.frameElement === undefined) {
      this.frameElement = this.initFrameView();
    }
    return this.frameElement;
  }
}
