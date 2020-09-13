import DateType from './DateType';
import ViewType from './ViewType';

interface ViewConfiguration {
  dateType: DateType;
  viewType: ViewType;
  maxDate?: Date;
  minDate?: Date;
  continuousScroll?: boolean;
  looping?: boolean;
  grouped?: boolean;
}

class ViewConfiguration {
  dateType: DateType;
  viewType: ViewType;
  maxDate?: Date;
  minDate?: Date;
  continuousScroll?: boolean;
  looping?: boolean;
  grouped?: boolean;

  constructor(config: ViewConfiguration) {
    Object.assign(this, config)
  }
}

export default ViewConfiguration;
