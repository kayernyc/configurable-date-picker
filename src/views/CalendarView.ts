/**
 * Owns both the top nav (AM/PM) and the list
 */

import AtomicDateObject from '../models/AtomicDateObject';
import DatePickerFactory from '../models/datePickerFactory/DatePickerFactory';
import WeekDateObject from '../models/WeekDateObject';
import ViewConfiguration from '../enums/ViewConfiguration';
import DatePickerBaseView from './DatePickerBaseView';
import ViewHeader from './uicomponents/ViewHeader/ViewHeader';
import ViewHeaderModel from './uicomponents/ViewHeader/ViewHeaderModel';

import { IntersectedAdo } from './virtualDom/VirtualDom';

export default class CalendarView extends DatePickerBaseView implements IntersectedAdo {
  continuousScroll: boolean;
  private viewHeader: ViewHeader | undefined;
  private viewHeaderModel: ViewHeaderModel | undefined;

  constructor(model: DatePickerFactory, viewConfiguration: ViewConfiguration, viewHeader?: ViewHeader) {
    // when min/max is implemented, looping will be possible
    super(model, true, false);
    this.frameElementClassName = 'date-picker-list';
    this.viewHeader = viewHeader;
  }

  updateIntersectedAdo(ado: AtomicDateObject | WeekDateObject): void {
    const { date } = ado;
    console.log(this.model.dateTimeFormat)

    this.viewHeader.updateRepresentedDateString(date.toLocaleString(['en-us'], { year: 'numeric', month: 'long' }));
  }

  updateView(array: AtomicDateObject[], frameElement = this.frameElement): void {
    if (this.virtualDom) {
      this.virtualDom.intersectedAdoProxy = this;
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

  testFunction = (date: Date) => {
    console.log(`I got this date ${date}`)
  }

  append(parentElement: HTMLElement): void {
    if (this.viewHeader) {
      this.viewHeaderModel = new ViewHeaderModel()
      this.viewHeader.append(parentElement, this.viewHeaderModel);
      const unsubscribe = this.viewHeaderModel.subscribe(this.testFunction)
    }
    this.initFrameView();

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
