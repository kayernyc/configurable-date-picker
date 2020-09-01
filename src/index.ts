import DatePickerModel from './models/DatePickerModel';
import DatePickerControl from './DatePickerControl';

import './css/style.css'

declare global {
  interface Window {
    datePickerControl: DatePickerControl;
  }
}

const model = new DatePickerModel()
const container = document.createElement('div')
document.body.append(container)

const datePickerControl = new DatePickerControl(model, container, [{ dateType: 5, viewType: 0, grouped: true }])

window.datePickerControl = datePickerControl;
