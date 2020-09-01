import DatePickerBaseView from './DatePickerBaseView';
import DatePickerView from './DatePickerViewInterface';
import DatePickerFactory from '../models/datePickerFactory/DatePickerFactory';

export default class DatePickerGridView extends DatePickerBaseView
  implements DatePickerView {
  continuousScroll = false;

  constructor(model: DatePickerFactory, continuousScroll = false) {
    super(model, continuousScroll);
    this.frameElementClassName = 'date-picker-grid';
  }

  protected populateView(
    model: DatePickerFactory,
    frameElement: HTMLElement
  ): void {
    throw new Error('Override populateView');
  }
}
