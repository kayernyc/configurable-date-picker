import ViewConfiguration from "../../enums/ViewConfiguration";

export default class ViewHeader {
  private mainText: HTMLElement;

  private createHeaderElement(): HTMLElement {
    const header = document.createElement('div');
    header.className = 'view-header';
    const mainText = document.createElement('div');
    mainText.className = 'main-text';
    mainText.innerHTML = 'placeholer';
    this.mainText = mainText;
    header.append(mainText);
    return header;
  }

  // API
  append(parentElement: HTMLElement): void {
    const header = this.createHeaderElement();
    parentElement.append(header);
  }

  updateMainText(text: string): void {
    this.mainText.innerHTML = text;
  }
}
