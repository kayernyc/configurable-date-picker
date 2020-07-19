import DateType from "./DateType";
import ViewType from "./ViewType";

interface ViewConfiguration {
  dateType: DateType;
  viewType: ViewType;
  maxDate?: Date;
  minDate?: Date;
}

class ViewConfiguration {
  dateType: DateType;
  viewType: ViewType;
  maxDate?: Date;
  minDate?: Date;

  constructor(config: ViewConfiguration) {
    Object.assign(this, config)
  }
}


export default ViewConfiguration;
