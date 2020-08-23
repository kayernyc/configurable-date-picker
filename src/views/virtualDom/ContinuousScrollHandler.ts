import AtomicDateObject from "../../models/AtomicDateObject";
import DatePickerFactory from "../../models/datePickerFactory/DatePickerFactory";
import BuildConfiguration from "./BuildConfiguration";

import { DATA_TAG_STRING, addElement } from "./VirtualDomConst";

type ScrollHandlingFunction = (valence: boolean) => number;

export default class ContinuousScrollHandler {
  private dataArr: AtomicDateObject[];
  private frameElement: HTMLElement;
  private model: DatePickerFactory;

  private continuous: boolean;
  private looping = false;
  private handler: ScrollHandlingFunction;

  private firstAdo: AtomicDateObject;
  private lastAdo: AtomicDateObject;

  private adoElDictionary: { [id: string]: AtomicDateObject } = {};

  static initDataArr(
    dataArr: AtomicDateObject[],
    looping: boolean
  ): AtomicDateObject[] {
    let ado: AtomicDateObject;
    for (let i = 0; i < dataArr.length; i++) {
      ado = dataArr[i];
      if (i > 0) {
        const prevAdo = dataArr[i - 1];
        ado.prev = prevAdo;
        prevAdo.next = ado;
      }
    }

    if (looping) {
      ado.next = dataArr[0];
      dataArr[0].prev = ado;
    }

    return dataArr;
  }

  /**
   *
   * @param dataArr
   * @param frameElement
   * @param buffer
   */
  static initAdoElDictionary(
    dataArr: AtomicDateObject[],
    frameElement: HTMLElement,
    targetHeight: number,
    buffer: number
  ): { [id: string]: AtomicDateObject } {
    const adoElDictionary: { [id: string]: AtomicDateObject } = {};
    // const elArray = Array.from(frameElement.children);

    // for (let i = 0; i < elArray.length; i++) {
    //   const ado = dataArr[i];
    //   const el = elArray[i];
    //   const key = el.getAttribute(DATA_TAG_STRING);
    //   adoElDictionary[key] = ado;
    // }
    let index = 0;
    while (frameElement.offsetHeight < targetHeight) {
      if (index >= dataArr.length) {
        // append to dataArr
        dataArr.push(dataArr[0])
      }

      const ado = dataArr[index];

      frameElement.appendChild(addElement(ado, index));
      index++;
    }

    return adoElDictionary;
  }

  constructor(
    model: DatePickerFactory,
    frameElement: HTMLElement,
    continuous = true
  ) {
    // determine if there are enough members

    if (model.looping) {
      this.handler = this.loop;
      this.looping = model.looping;
      return;
    }

    // only hold a reference to the model if
    // it's needed
    this.model = model;
    this.handler = this.continuousScroll;
  }

  private firstElement(frameElement = this.frameElement): HTMLElement {
    if (frameElement.children.length < 1) {
      throw Error(" frameElement has no children");
    }

    return frameElement.removeChild(frameElement.children[0]) as HTMLElement;
  }

  private lastElement(frameElement = this.frameElement): HTMLElement {
    if (frameElement.children.length < 1) {
      throw Error(" frameElement has no children");
    }

    return frameElement.removeChild(
      frameElement.children[frameElement.children.length - 1]
    ) as HTMLElement;
  }

  private continuousScroll(valence: boolean): number {
    const el: HTMLElement = valence ? this.lastElement() : this.firstElement();
    const key: string = el.getAttribute(DATA_TAG_STRING);

    const ado = this.adoElDictionary[key] as AtomicDateObject;
    const newIndex = this.dataArr.indexOf(ado) + (valence ? 1 : -1);
    const newAdo: AtomicDateObject | undefined = this.dataArr[newIndex];

    if (newAdo === undefined) {
      // create new record
    } else {
      // get existing record
      this.adoElDictionary[key] = newAdo;
      el.innerHTML = newAdo.viewString;
    }

    valence ? this.frameElement.prepend(el) : this.frameElement.appendChild(el);
    return el.offsetHeight;
  }

  private loop(valence: boolean, frameElement = this.frameElement): number {
    let currentEl: HTMLElement;
    let newEl: HTMLElement;
    let newAdo: AtomicDateObject;

    if (valence) {
      currentEl = frameElement.children[0] as HTMLElement;
      // last el goes to beginning
      newEl = this.lastElement();
      newAdo = this.adoElDictionary[currentEl.getAttribute(DATA_TAG_STRING)]
        .prev as AtomicDateObject;
    } else {
      currentEl = frameElement.children[
        frameElement.children.length - 1
      ] as HTMLElement;
      // first el goes to end
      newAdo = this.adoElDictionary[currentEl.getAttribute(DATA_TAG_STRING)]
        .next as AtomicDateObject;
      newEl = this.firstElement();
    }

    this.adoElDictionary[newEl.getAttribute(DATA_TAG_STRING)] = newAdo;
    newEl.innerHTML = newAdo.viewString;
    valence ? frameElement.prepend(newEl) : frameElement.appendChild(newEl);
    return newEl.offsetHeight;
  }

  // API

  addMember(ado: AtomicDateObject, append: boolean = true) {
    if (this.looping) {
      throw new Error("can't modify looping set");
    }

    if (append) {
      this.lastAdo.next = ado;
      ado.prev = this.lastAdo;
      this.lastAdo = ado;
      return;
    }

    this.firstAdo.prev = ado;
    ado.next = this.firstAdo;
    this.firstAdo = ado;
  }

  initFrame(config: BuildConfiguration) {
    const { buffer, dataArr, frameElement, targetHeight } = config;
    frameElement.style.top = `${-buffer}px`;
    // inits linked list
    this.dataArr = ContinuousScrollHandler.initDataArr(
      [...dataArr],
      this.looping
    );

    // populates frameElement and creates dictionary of nodes: ado
    this.adoElDictionary = ContinuousScrollHandler.initAdoElDictionary(
      this.dataArr,
      frameElement,
      targetHeight,
      buffer
    );

    this.frameElement = frameElement;

    // for continuous, don't search the linked list
    if (!this.looping) {
      this.firstAdo = this.dataArr[0];
      this.lastAdo = this.dataArr[this.dataArr.length - 1];
    }
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
