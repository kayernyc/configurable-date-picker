import VirtualDom from "../virtualDom/VirtualDom";

export default class TopItemObserver {
  private observed: HTMLElement | VirtualDom;
  constructor(observed: HTMLElement | VirtualDom) {
    this.observed = observed;
  }
}
