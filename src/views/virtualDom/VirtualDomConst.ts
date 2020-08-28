import AtomicDateObject from "../../models/AtomicDateObject";
import WeekDateObject from "../../models/WeekDateObject";

const NUM_ELEMENTS_LIMIT = 12;
const DATA_TAG_STRING = 'data-element-index';

function addElement(ado: AtomicDateObject | WeekDateObject, index: number): HTMLElement {
  const el = document.createElement("div");
  el.setAttribute(DATA_TAG_STRING, `${index}`);
  el.innerHTML = ado.viewString;
  return el;
}

export {
  NUM_ELEMENTS_LIMIT,
  DATA_TAG_STRING,
  addElement,
}
