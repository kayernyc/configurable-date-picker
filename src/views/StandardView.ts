import DatePickerFactory from '../models/datePickerFactory/DatePickerFactory';
import ViewConfiguration from '../enums/ViewConfiguration';
import DatePickerBaseView from './DatePickerBaseView';

export default class StandardView extends DatePickerBaseView {
  continuousScroll: boolean;
  initialCount: number;

  constructor(
    model: DatePickerFactory,
    viewConfiguration: ViewConfiguration,
    grid = false
  ) {
    const { continuousScroll, initialCount, looping } = viewConfiguration;

    super(model, continuousScroll, looping);

    this.initialCount = initialCount;
    this.frameElementClassName = grid ? 'date-picker-grid' : 'date-picker-list';
  }

  populateView(
    model: DatePickerFactory = this.model,
    frameElement: HTMLElement = this.frameElement,
    initialCount = this.initialCount
  ): void {
    const array = model.dateArray(initialCount);
    if (this.virtualDom) {
      // DatePickerBaseView has determined that a virtualDom is needed
      this.virtualDom.buildView(array, frameElement);
      return;
    }
    this.adoArray = array
    this.buildDateView(array);
  }
}
