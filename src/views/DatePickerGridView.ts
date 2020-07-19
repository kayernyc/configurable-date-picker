import DatePickerType from "../models/DatePickerFactory";
import DatePickerBaseView from "./DatePickerBaseView";
import DatePickerView from "./DatePickerViewInterface";

export default class DatePickerGridView extends DatePickerBaseView
  implements DatePickerView {
  continuousScroll = false;

  constructor(model: DatePickerType, continuousScroll = false) {
    super();
    this.model = model;
    this.initContainerView();
  }
}
