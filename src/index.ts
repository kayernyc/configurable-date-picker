import DatePickerModel from './models/DatePickerModel';
import DatePickerControl from './DatePickerControl';

import "./css/style.css"

declare global {
  interface Window {
    datePickerControl: DatePickerControl;
  }
}

let model = new DatePickerModel()
let container = document.createElement('div')
document.body.appendChild(container)

const datePickerControl = new DatePickerControl(model, container, [{dateType: 6, viewType: 0}])

window.datePickerControl = datePickerControl

console.log(datePickerControl)
