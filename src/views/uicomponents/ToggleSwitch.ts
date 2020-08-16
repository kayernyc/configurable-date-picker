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

  private select(evt: MouseEvent) {
    const context = (this as unknown) as ValueContext;
    const { index, value, proxy } = context;
    if (proxy) {
      const switchSelected = this.proxy.selectValue(index, value);
      console.log(switchSelected);
    }
  }

  append(parentElement: HTMLElement): void {
    const frame = document.createElement("form");
    frame.className = "toggle-switch";

    for (const [index, value] of this.valuesArray.entries()) {
      const radioButton = document.createElement("input");
      radioButton.type = "radio";
      radioButton.id = value;
      radioButton.name = "bob";
      radioButton.hidden = true;
      radioButton.value = value;
      radioButton.className = "toggle-switch-value";
      const radioLabel = document.createElement("label");
      radioLabel.htmlFor = value;
      radioLabel.innerHTML = value;
      radioLabel.onmousedown = this.select.bind({
        index,
        value,
        proxy: this.proxy,
      });
      frame.appendChild(radioButton);
      frame.appendChild(radioLabel);
    }

    parentElement.appendChild(frame);
  }
}
