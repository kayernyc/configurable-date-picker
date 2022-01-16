import DateSetterForm, { DateSetterFormProxy, DateSetterFormConfig } from '../DateSetterForm';
import ViewHeaderModel from './ViewHeaderModel';

export default class ViewHeader implements DateSetterFormProxy {
  private dateSetterForm?: DateSetterForm;
  private mainText: HTMLElement;
  private isForm = false;

  constructor(dateSetterForm?: DateSetterForm) {
    this.dateSetterForm = dateSetterForm;
    if (dateSetterForm) {
      this.isForm = true;
    }
  }

  updateRepresentedDateString(targetDate: string): boolean {
    console.log(`from ViewHeader ${targetDate}`);
    if (this.isForm) {
      this.dateSetterForm.updateDateValue(targetDate);
    } else {
      this.mainText.innerHTML = targetDate;
    }
    return true;
  }

  private createHeaderElement(isForm = this.isForm): HTMLElement {
    const header = document.createElement('div');
    header.className = 'view-header';

    if (isForm) {
      this.dateSetterForm.append(header);
    } else {
      const mainText = document.createElement('div');
      mainText.className = 'main-text';
      mainText.innerHTML = 'placeholder';
      this.mainText = mainText;
      header.append(mainText);
    }

    return header;
  }

  // API
  append(parentElement: HTMLElement, model?: ViewHeaderModel): void {
    const header = this.createHeaderElement();
    parentElement.append(header);
  }

  updateMainText(text: string): void {
    this.mainText.innerHTML = text;
  }
}
