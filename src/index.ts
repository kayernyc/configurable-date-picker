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

const datePickerControl = new DatePickerControl(model, container, [{ dateType: 7, viewType: 0, grouped: true, continuousScroll: false, looping: false, seedDate: new Date('December 17, 1995 03:24:00') }])
window.datePickerControl = datePickerControl;
