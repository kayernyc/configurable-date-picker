import DatePickerType from "../models/datePickerFactory/DatePickerFactory";
import DatePickerBaseView from "./DatePickerBaseView";
import DatePickerView from "./DatePickerViewInterface";

export default class DatePickerGridView extends DatePickerBaseView
  implements DatePickerView {

  continuousScroll = false;

  constructor(model: DatePickerType, continuousScroll = false) {
    super();
    this.model = model;
    // initFrameView is in the super
    this.frameElement = this.initFrameView(continuousScroll);
    this.frameElement.className += " date-picker-grid";
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

  append(parentElement: HTMLElement): void {
    throw new Error("Method not implemented.");
  }
}
