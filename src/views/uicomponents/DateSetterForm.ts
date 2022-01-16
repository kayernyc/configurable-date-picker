import { RandomString } from '../../utils/RandomString';

export interface DateSetterFormProxy {
  updateRepresentedDateString: (targetDate: string) => boolean;
}

export interface DateSetterFormConfig {
  formName: string,
  id?: string,
  initialValue: string,
  labelText?: string,
  maxDate?: Date;
  minDate?: Date;
  proxy?: DateSetterFormProxy,
}

export default class DateSetterForm {
  config: DateSetterFormConfig;
  formElement: HTMLFormElement;
  labelElement: HTMLLabelElement;
  inputElement: HTMLInputElement;
  proxy?: DateSetterFormProxy;

  constructor(config?: DateSetterFormConfig) {
    this.config = config;
  }

  private validateDate = (dateString: string): string => {
    // const { value: dateString } = inputField;
    // inputField.value = dateString
    const testDate = new Date(dateString)
    if (Number.isNaN(testDate.getTime())) {
      return '';
    }
    return dateString;
  }

  private inputEventHandler = (event: InputEvent): void => {
    event.preventDefault();

    const target: HTMLInputElement = event.target as HTMLInputElement;
  }

  private keyInputHander = (event: KeyboardEvent): void => {
    const { ctrlKey, key, metaKey } = event
    const target: HTMLInputElement = event.target as HTMLInputElement;
    const candidateValue = this.validateDate(target.value);

    if (key === 'Enter') {
      event.preventDefault();
      if (candidateValue.length > 0 && this.proxy) {
        this.proxy.updateRepresentedDateString(candidateValue);
      }
    }

    if ((metaKey || ctrlKey) && (key === 'c' || key === 'v' || key === 'x')) {
      // this.validateDate(candidateValue)
    }
  }

  private inputField = (): HTMLInputElement => {
    const inputField = document.createElement('input');
    inputField.addEventListener('input', this.inputEventHandler);
    inputField.addEventListener('keydown', this.keyInputHander);

    return inputField;
  }

  private createFormElement(config = this.config): HTMLFormElement {
    const { formName, id, labelText, maxDate, minDate, proxy } = config;
    const maxDateAttribute = maxDate ? `max="${maxDate.toTimeString()}"` : '';
    const minDateAttribute = minDate ? `max="${minDate.toTimeString()}"` : '';

    this.formElement = document.createElement('form');

    if (labelText) {
      this.labelElement = document.createElement('label');
      this.labelElement.setAttribute('for', id);
      this.labelElement.innerHTML = labelText;
      this.formElement.append(this.labelElement);
    }

    this.inputElement = this.inputField()

    this.inputElement.setAttribute('id', id);
    this.inputElement.setAttribute('type', 'text')
    this.inputElement.setAttribute('name', formName);
    this.inputElement.setAttribute('value', 'bob')

    this.formElement.append(this.inputElement);

    // <input id="${id}" name=${formName} ${maxDateAttribute} ${minDateAttribute} value="bob">`

    return this.formElement;
  }

  // API
  updateDateValue(inputString: string): void {
    this.inputElement.setAttribute('value', inputString)
  }

  append(parentElement: HTMLElement, config = this.config): void {
    if (config === undefined) {
      throw new Error('DateSetterConfig needs a configuration before it is appended.')
    } else if (config !== this.config) {
      this.config = config
    }

    const form = this.createFormElement();
    parentElement.append(form);
  }
}