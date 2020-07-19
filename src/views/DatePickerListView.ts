import DatePickerFactory from "../models/DatePickerFactory";
import DatePickerBaseView from "./DatePickerBaseView";
import DatePickerView from "./DatePickerViewInterface";
import AtomicDateObject from "../models/AtomicDateObject";

export default class DatePickerListView extends DatePickerBaseView
  implements DatePickerView {
  continuousScroll: Boolean;

  constructor(model: DatePickerFactory, continuousScroll = true) {
    super();
    console.log(' I Got CALLED')
    this.continuousScroll = continuousScroll;
    this.model = model;
    this.containerView = this.initContainerView();
    this.populateView();
  }

  populateView(model: DatePickerFactory = this.model, containerView: HTMLElement = this.containerView) {
    console.log('populate view ', model)
    const arr = model.dateArray(12)
    
    arr.forEach((date: AtomicDateObject) => {
      const el = document.createElement('div')
      el.innerHTML = date.viewString
      containerView.appendChild(el)
    })

  }
}
