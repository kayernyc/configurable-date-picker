/*
 These views only present dates, not navigation
 */
import AtomicDateObject from "../models/AtomicDateObject";
import ContinuousScrollHandler from "./virtualDom/ContinuousScrollHandler";
import DatePickerFactory from "../models/datePickerFactory/DatePickerFactory";
import VirtualDom from "./virtualDom/VirtualDom";

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

  /**
   * Triggered by append call.
   *
   * @param continuousScroll
   */
  protected initFrameView(continuousScroll = true): HTMLElement {
    this.frameElement = document.createElement("div");

    if (continuousScroll) {
      // init ContinuousScrollHandler
      this.virtualDom = new VirtualDom(
        new ContinuousScrollHandler(this.model, this.frameElement)
      );
      this.frameElement.appendChild(this.virtualDom.frameElement);
      console.log("---- VIRTUAL DOM");
    } else {
      console.log("no virtual dom");
    }

    return this.frameElement;
  }

  append(parentElement: HTMLElement): void {
    this.frameElement = this.initFrameView(this.continuousScroll);
    this.frameElement.className += "date-picker-view";
    const classNames = this.frameElement.className.split(" ");
    classNames.push(this.frameElementClassName);
    this.frameElement.className = classNames.join(" ");
  }

  protected abstract populateView(
    model: DatePickerFactory,
    frameElement: HTMLElement
  ): void;

  /**
   *
   * @param arr AtomicDateObject[]
   * @param frameElement
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
