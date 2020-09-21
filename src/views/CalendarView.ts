/**
 * Owns both the top nav (AM/PM) and the list
 */

import AtomicDateObject from '../models/AtomicDateObject';
import DatePickerFactory from '../models/datePickerFactory/DatePickerFactory';
import WeekDateObject from '../models/WeekDateObject';
import ViewConfiguration from '../enums/ViewConfiguration';
import DatePickerBaseView from './DatePickerBaseView';
import ViewHeader from './uicomponents/ViewHeader';
import TopItemObserver from './utilities/TopItemObserver';
import VirtualDom from './virtualDom/VirtualDom';

export default class CalendarView extends DatePickerBaseView {
  continuousScroll: boolean;
  private viewHeader: ViewHeader;
  private topItemObserver: TopItemObserver;

  constructor(model: DatePickerFactory, viewConfiguration: ViewConfiguration) {
    // when min/max is implemented, looping will be possible
    super(model, true, false);
    this.frameElementClassName = 'date-picker-list';
    this.viewHeader = new ViewHeader(viewConfiguration);
  }

  updateView(array: AtomicDateObject[], frameElement = this.frameElement): void {
    if (this.virtualDom) {
      this.virtualDom.buildView(array, frameElement, undefined, 'calendar');
      return;
    }

    this.buildDateView(array as WeekDateObject[]);
  }

  buildDateView(weeksArray: WeekDateObject[], frameElement: HTMLElement = this.frameElement): void {
    weeksArray.forEach(week => {
      frameElement.innerHTML += week.viewString;
    })
  }

  append(parentElement: HTMLElement): void {
    this.viewHeader.append(parentElement)
    this.initFrameView();

    const observed: VirtualDom | HTMLElement = this.virtualDom ? this.virtualDom : this.frameElement
    this.topItemObserver = new TopItemObserver(observed)

    this.frameElement.className = this.appendClassName('');
    parentElement.append(this.frameElement);
    this.populateView();
  }

  populateView(
    model: DatePickerFactory = this.model,
    frameElement: HTMLElement = this.frameElement
  ): void {
    const array = model.dateArray(3);
    this.updateView(array, frameElement);
  }
}
