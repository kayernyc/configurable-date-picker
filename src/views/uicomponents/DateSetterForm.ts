import { RandomString } from '../../utils/RandomString';

export interface DateSetterFormProxy {
  updateRepresentedDate: (targetDate: Date) => boolean;
}

export interface DateSetterFormConfig {
  formName: string,
  id?: string,
  initialValue: string,
  labelText: string,
  maxDate?: Date;
  minDate?: Date;
  proxy?: DateSetterFormProxy,
}

export default class DateSetterForm {
  config: DateSetterFormConfig;
  proxy?: DateSetterFormProxy;

  constructor(config?: DateSetterFormConfig) {
    this.config = config;
  }

  private formElement(config = this.config): HTMLFormElement {
    const { formName, id, labelText, maxDate, minDate, proxy } = config;
    const maxDateAttribute = maxDate ? `max="${maxDate.toTimeString()}"` : '';
    const minDateAttribute = minDate ? `max="${minDate.toTimeString()}"` : '';

    const formElement = document.createElement('form');
    formElement.innerHTML = `<label for="${id}">${labelText}</label>
      <input id="${id}" name=${formName} ${maxDateAttribute} ${minDateAttribute}>`
    return formElement;
  }

  // API
  append(parentElement: HTMLElement, config = this.config): void {
    if (config === undefined) {
      throw new Error('DateSetterConfig needs a configuration before it is appended.')
    } else if (config !== this.config) {
      this.config = config
    }

    const form = this.formElement();
    parentElement.append(form);
  }
}