import AtomicDateObject from "../models/AtomicDateObject";
import DatePickerBaseView from "./DatePickerBaseView";
import DatePickerView from "./DatePickerViewInterface";
import DatePickerFactory from "../models/DatePickerFactory";

export default class DatePickerGridView extends DatePickerBaseView
  implements DatePickerView {
  continuousScroll = false;

  constructor(model: DatePickerFactory, continuousScroll = false) {
    super();
    this.continuousScroll = continuousScroll;
    this.model = model;
  }

  append(parentElement: HTMLElement): void {
    this.frameElement = this.initFrameView(this.continuousScroll);
    this.frameElement.className += " date-picker-grid";
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
   * When the grid view does not continuously scroll
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
