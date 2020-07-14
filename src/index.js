"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DatePickerModel_1 = require("./DatePickerModel");
var DatePickerControl_1 = require("./DatePickerControl");
var model = new DatePickerModel_1.default();
var container = document.createElement('div');
var datePickerControl = new DatePickerControl_1.default(model, container);
console.log(datePickerControl);
//# sourceMappingURL=index.js.map