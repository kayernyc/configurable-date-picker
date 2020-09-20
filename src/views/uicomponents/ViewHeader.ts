import ViewConfiguration from "../../enums/ViewConfiguration";

export default class ViewHeader {
  constructor(viewConfiguration: ViewConfiguration) {
    console.log('I am here')
  }

  private createHeaderElement(): HTMLElement {
    const header = document.createElement('div');
    header.innerHTML = 'placeholer';
    return header;
  }

  append(parentElement: HTMLElement): void {
    const header = this.createHeaderElement()
    parentElement.append(header);
  }
}