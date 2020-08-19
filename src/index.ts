import DatePickerModel from './models/DatePickerModel';
import DatePickerControl from './DatePickerControl';

import "./css/style.css"

declare global {
  interface Window {
    datePickerControl: DatePickerControl;
  }
}

const model = new DatePickerModel()
const container = document.createElement('div')
document.body.appendChild(container)

const datePickerControl = new DatePickerControl(model, container, [{dateType: 5, viewType: 1}])

window.datePickerControl = datePickerControl

console.log(datePickerControl)
