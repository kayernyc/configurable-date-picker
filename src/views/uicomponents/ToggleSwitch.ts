interface ToggleSwitchProxy {
  selectValue: (index: number, value: string) => boolean;
}

interface ValueContext {
  index: number;
  proxy: ToggleSwitchProxy | undefined;
  value: string;
}

export { ToggleSwitchProxy };

export default class ToggleSwitch {
  valuesArray: string[];
  proxy: ToggleSwitchProxy;

  constructor(valuesArray: string[]) {
    this.valuesArray = valuesArray;
  }

  private select() {
    const context = (this as unknown) as ValueContext;
    const { index, value, proxy } = context;
    if (proxy) {
      this.proxy.selectValue(index, value);
    }
  }

  private createRadioLabelPair(
    index: number,
    value: string,
    formName: string
  ): [HTMLInputElement, HTMLLabelElement] {
    const radioButton = document.createElement('input');
    radioButton.type = 'radio';
    radioButton.id = value;
    radioButton.name = formName;
    radioButton.hidden = true;
    radioButton.value = value;
    radioButton.className = 'toggle-switch-value';

    const radioLabel = document.createElement('label');
    radioLabel.htmlFor = value;
    radioLabel.innerHTML = value;
    radioLabel.addEventListener("click", this.select.bind({
      index,
      value,
      proxy: this.proxy,
    }), { passive: true });
    radioLabel.addEventListener("touchstart", this.select.bind({
      index,
      value,
      proxy: this.proxy,
    }), { passive: true });

    return [radioButton, radioLabel];
  }

  append(parentElement: HTMLElement, startIndex = 0, formName?: string): void {
    const frame = document.createElement("form");
    frame.className = "toggle-switch";
    startIndex = Math.min(this.valuesArray.length, startIndex);

    for (const [index, value] of this.valuesArray.entries()) {
      const [radioButton, radioLabel] = this.createRadioLabelPair(
        index,
        value,
        formName
      );

      if (index === startIndex) {
        radioButton.checked = true;
      }

      frame.append(radioButton);
      frame.append(radioLabel);
    }

    parentElement.append(frame);
  }
}
