import DateType from './DateType';
import ViewType from './ViewType';
import { DateSetterFormConfig } from '../views/uicomponents/DateSetterForm'

export interface ViewConfigurationHeader {
  form: DateSetterFormConfig | undefined
}

interface ViewConfiguration {
  continuousScroll?: boolean;
  dateType: DateType;
  grouped?: boolean;
  header?: ViewConfigurationHeader | undefined;
  initialCount?: number;
  looping?: boolean;
  maxDate?: Date;
  minDate?: Date;
  seedDate?: Date;
  viewType: ViewType;
}

class ViewConfiguration {
  continuousScroll?: boolean;
  dateType: DateType;
  grouped?: boolean;
  initialCount?: number;
  looping?: boolean;
  maxDate?: Date;
  minDate?: Date;
  seedDate?: Date;
  viewType: ViewType;

  constructor(config: ViewConfiguration) {
    Object.assign(this, config)
  }
}

export default ViewConfiguration;
