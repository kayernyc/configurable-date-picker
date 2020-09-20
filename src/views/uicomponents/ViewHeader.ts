import ViewConfiguration from "../../enums/ViewConfiguration";

export default class ViewHeader {
  private mainText: string

  constructor(viewConfiguration: ViewConfiguration) {
    console.log('I am here');
    this.mainText = 'bob'
  }

  private createHeaderElement(): HTMLElement {
    const header = document.createElement('div');
    header.className = 'view-header'
    const mainText = document.createElement('div');
    mainText.className = 'main-text'
    mainText.innerHTML = 'placeholer';
    header.append(mainText)
    return header;
  }

  // API
  append(parentElement: HTMLElement): void {
    const header = this.createHeaderElement();
    parentElement.append(header);
  }

  updateMainText(text: string) {
    console.log(text)
  }
}