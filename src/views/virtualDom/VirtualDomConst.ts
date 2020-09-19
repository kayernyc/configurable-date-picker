import AtomicDateObject from '../../models/AtomicDateObject';
import WeekDateObject from '../../models/WeekDateObject';

const NUM_ELEMENTS_LIMIT = 12;
const DATA_TAG_STRING = 'data-element-index';
const DATA_ADO_STRING = 'data-ado-index'

type DateElementHandlerFunction = (event: MouseEvent) => boolean;

/**
 * @param ado
 * @param index
 */
function addElement(ado: AtomicDateObject | WeekDateObject, index: number, handler?: DateElementHandlerFunction): HTMLElement {
  const element = document.createElement('div');
  element.className = 'ado-date-view'

  if (ado instanceof WeekDateObject) {
    element.className = 'ado-week-view'
  }

  element.setAttribute(DATA_TAG_STRING, `${index}`);
  element.innerHTML = ado.viewString;

  element.addEventListener('click', (event: MouseEvent) => {
    event.preventDefault()
    handler(event)
  });

  return element;
}

export {
  addElement,
  DATA_ADO_STRING,
  DATA_TAG_STRING,
  DateElementHandlerFunction,
  NUM_ELEMENTS_LIMIT
}
