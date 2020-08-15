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
      this.proxy.selectValue(index, value);
    }
  }

  append(parentElement: HTMLElement): void {
    const frame = document.createElement("div");
    frame.className = "toggle-switch";

    for (const [index, value] of this.valuesArray.entries()) {
      const el = document.createElement("div");
      el.onmousedown = this.select.bind({ index, value, proxy: this.proxy });
      el.innerHTML = value;
      el.className = "toggle-switch-value";
      frame.appendChild(el);
    }

    parentElement.appendChild(frame);
  }
}
