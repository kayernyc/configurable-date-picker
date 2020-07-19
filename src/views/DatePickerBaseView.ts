import DatePickerFactory from "../models/DatePickerFactory";

export default abstract class DatePickerBaseView {
  protected model: DatePickerFactory;
  protected containerView: HTMLElement;
  protected initContainerView(): HTMLElement {
    const view = document.createElement("div");
    view.className = "date-picker-view";
    return view;
  }
  get view (): HTMLElement {
    if (this.containerView === undefined) {
      this.containerView = this.initContainerView()
    }
    return this.containerView
  }
}
