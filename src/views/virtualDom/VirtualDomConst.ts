import AtomicDateObject from '../../models/AtomicDateObject';
import WeekDateObject from '../../models/WeekDateObject';

const NUM_ELEMENTS_LIMIT = 12;
const DATA_TAG_STRING = 'data-element-index';

/**
 * @param ado
 * @param index
 */
function addElement(ado: AtomicDateObject | WeekDateObject, index: number): HTMLElement {
  const element = document.createElement('div');
  element.setAttribute(DATA_TAG_STRING, `${index}`);
  element.innerHTML = ado.viewString;
  return element;
}

export {
  NUM_ELEMENTS_LIMIT,
  DATA_TAG_STRING,
  addElement,
}
