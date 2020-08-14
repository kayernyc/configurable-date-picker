/**
 *  if continuous scroll is true or number of dates is more than 12 init virtual dom.
 *  if there is a virtual dom, then normal scrolling is disabled.
 */
import AtomicDateObject from "../models/AtomicDateObject";
import DatePickerFactory from "../models/DatePickerFactory";
import DatePickerBaseView from "./DatePickerBaseView";
import DatePickerView from "./DatePickerViewInterface";

export default class DatePickerListView extends DatePickerBaseView
  implements DatePickerView {
  continuousScroll: boolean;

  constructor(model: DatePickerFactory, continuousScroll = true) {
    super();
    this.continuousScroll = continuousScroll;
    this.model = model;
  }

  append (parentElement: HTMLElement): void {
    this.frameElement = this.initFrameView(this.continuousScroll);
    this.frameElement.className += " date-picker-list";
  }

  protected populateView(
    model: DatePickerFactory,
    containerView: HTMLElement,
    frameElement: HTMLElement
  ) {
    throw new Error("Override populateView");
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
}
