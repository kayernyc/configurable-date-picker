import AtomicDateObject from "../../models/AtomicDateObject";
import DatePickerFactory from "../../models/DatePickerFactory";
import BuildConfiguration from "./BuildConfiguration";

import { DATA_TAG_STRING, addElement } from "./VirtualDomConst";

type ScrollHandlingFunction = (valence: boolean) => number;

export default class ContinuousScrollHandler {
  private dataArr: AtomicDateObject[];
  private frameElement: HTMLElement;
  private model: DatePickerFactory;

  private continuous: boolean;
  private looping: boolean;
  private handler: ScrollHandlingFunction;

  constructor(model: DatePickerFactory, continuous = true, looping = false) {
    console.log("continuous is here");
    this.handler = this.loop;

    this.model = model;
  }

  private firstElement(frameElement = this.frameElement): HTMLElement {
    return this.frameElement.removeChild(
      this.frameElement.children[0]
    ) as HTMLElement;
  }

  private lastElement(frameElement = this.frameElement): HTMLElement {
    return this.frameElement.removeChild(
      this.frameElement.children[this.frameElement.children.length - 1]
    ) as HTMLElement;
  }

  private loop(valence: boolean): number {
    let el: HTMLElement;
    let targetIndex: number;

    if (valence) {
      el = this.lastElement();
      targetIndex =
        parseInt(
          this.frameElement.children[0].getAttribute(DATA_TAG_STRING),
          10
        ) - 1;
    } else {
      el = this.firstElement();
      targetIndex =
        parseInt(
          this.frameElement.children[0].getAttribute(DATA_TAG_STRING),
          10
        ) - 1;
    }

    const newIndex = this.newIndex(targetIndex);

    el.setAttribute(DATA_TAG_STRING, `${newIndex}`);
    el.innerHTML = this.dataArr[newIndex].viewString;

    valence ? this.frameElement.prepend(el) : this.frameElement.appendChild(el);
    return el.offsetHeight;
  }

  initFrame(dataArr: AtomicDateObject[], frameElement: HTMLElement) {
    this.dataArr = [...dataArr];
    this.frameElement = frameElement;
  }

  unshift(): number {
    return this.handler(true);
  }

  push(): number {
    return this.handler(false);
  }

  private newIndex(oldIndex: number): number {
    return (this.dataArr.length + oldIndex) % this.dataArr.length;
  }
}
