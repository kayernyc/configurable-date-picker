import AtomicDateObject from "../../models/AtomicDateObject";
import DatePickerFactory from "../../models/datePickerFactory/DatePickerFactory";
import BuildConfiguration from "./BuildConfiguration";

import { DATA_TAG_STRING, addElement } from "./VirtualDomConst";

type ScrollHandlingFunction = (valence: boolean) => number;

interface AdoElDictionaryFactoryConfig {
  buffer: number;
  dataArray: AtomicDateObject[];
  frameElement: HTMLElement;
  looping: boolean;
  model: DatePickerFactory;
  targetHeight: number;
}

export default class ContinuousScrollHandler {
  private dataArray: AtomicDateObject[];
  private frameElement: HTMLElement;
  private model: DatePickerFactory;

  private continuous: boolean;
  private looping = false;
  private handler: ScrollHandlingFunction;

  private firstAdo: AtomicDateObject;
  private lastAdo: AtomicDateObject;

  private adoElementDictionary: { [id: string]: AtomicDateObject } = {};

  static initDataArray(
    dataArray: AtomicDateObject[],
    looping: boolean
  ): AtomicDateObject[] {
    let ado: AtomicDateObject;
    for (let i = 0; i < dataArray.length; i++) {
      ado = dataArray[i];
      if (i > 0) {
        const previousAdo = dataArray[i - 1];
        ado.prev = previousAdo;
        previousAdo.next = ado;
      }
    }

    if (looping) {
      ado.next = dataArray[0];
      dataArray[0].prev = ado;
    }

    return dataArray;
  }

  /**
   *
   * @param dataArray
   * @param frameElement
   * @param buffer
   */
  static initAdoElDictionary(
    config: AdoElDictionaryFactoryConfig
  ): { [id: string]: AtomicDateObject } {
    const adoElementDictionary: { [id: string]: AtomicDateObject } = {};
    const { dataArray, frameElement, looping, model, targetHeight } = config;
    console.log({ targetHeight })

    let index = 0;
    while (frameElement.offsetHeight < targetHeight) {
      if (index >= dataArray.length) {
        if (looping) {
          throw new Error("Looping view doesn't have enough dates");
        }
        const newIndex = dataArray[dataArray.length - 1].index + 1;
        const newAdos = model.getAtomicDateObjectByIndex(newIndex);

        for (let i = 0; i < newAdos.length; i++) {
          const newAdo = newAdos[i];
          dataArray.push(newAdo);
        }

      }

      const ado = dataArray[index];
      const element = addElement(ado, index);
      const key = element.getAttribute(DATA_TAG_STRING);
      adoElementDictionary[key] = ado;

      frameElement.append(element);
      index++;
    }

    return adoElementDictionary;
  }

  constructor(
    model: DatePickerFactory,
    frameElement: HTMLElement,
    continuous = true
  ) {
    if (model.looping) {
      this.handler = this.loop.bind(this);
      this.looping = model.looping;
      return;
    }

    // only hold a reference to the model if
    // it's needed
    this.model = model;
    this.handler = this.continuousScroll.bind(this);
  }

  private firstElement(frameElement = this.frameElement): HTMLElement {
    if (frameElement.children.length < 1) {
      throw Error("FrameElement has no children");
    }

    return frameElement.removeChild(frameElement.children[0]) as HTMLElement;
  }

  private lastElement(frameElement = this.frameElement): HTMLElement {
    if (frameElement.children.length === 0) {
      throw new Error("FrameElement has no children");
    }

    return frameElement.removeChild(
      frameElement.children[frameElement.children.length - 1]
    ) as HTMLElement;
  }

  private continuousScroll(valence: boolean, frameElement = this.frameElement): number {
    // true = need a new first element
    // false = need a new last element
    const tailEl = valence ? this.frameElement.firstChild as HTMLElement : this.frameElement.lastChild as HTMLElement
    const key = tailEl.getAttribute(DATA_TAG_STRING)
    const tailAdo = this.adoElDictionary[key]
    let adoArr: AtomicDateObject[]
    let newAdo: AtomicDateObject
    let newElement: HTMLElement

    if (valence) {
      if (tailAdo.prev === undefined) {
        adoArr = this.model.getAtomicDateObjectByIndex(tailAdo.index - 1)
        tailAdo.prev = adoArr[adoArr.length - 1]
        tailAdo.prev.next = tailAdo
      }
      newAdo = tailAdo.prev
      newElement = this.lastElement()
    } else {
      if (tailAdo.next === undefined) {
        adoArr = this.model.getAtomicDateObjectByIndex(tailAdo.index + 1)
        tailAdo.next = adoArr[0]
        tailAdo.next.prev = tailAdo
      }
      newAdo = tailAdo.next
      newElement = this.firstElement()
    }

    this.adoElementDictionary[newElement.getAttribute(DATA_TAG_STRING)] = newAdo;
    newElement.innerHTML = newAdo.viewString;

    valence ? frameElement.prepend(newElement) : frameElement.append(newElement);
    return newElement.offsetHeight;
  }

  private loop(valence: boolean, frameElement = this.frameElement): number {
    let currentEl: HTMLElement;
    let newElement: HTMLElement;
    let newAdo: AtomicDateObject;

    if (valence) {
      currentEl = frameElement.children[0] as HTMLElement;
      // last el goes to beginning
      newElement = this.lastElement();
      newAdo = this.adoElementDictionary[currentEl.getAttribute(DATA_TAG_STRING)]
        .prev;
    } else {
      currentEl = frameElement.children[
        frameElement.children.length - 1
      ] as HTMLElement;
      // first el goes to end
      newAdo = this.adoElementDictionary[currentEl.getAttribute(DATA_TAG_STRING)]
        .next;
      newElement = this.firstElement();
    }

    this.adoElementDictionary[newElement.getAttribute(DATA_TAG_STRING)] = newAdo;
    newElement.innerHTML = newAdo.viewString;
    valence ? frameElement.prepend(newElement) : frameElement.append(newElement);
    return newElement.offsetHeight;
  }

  // API

  addMember(ado: AtomicDateObject, append = true): void {
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

  initFrame(config: BuildConfiguration): boolean {
    const { buffer, dataArray, frameElement, targetHeight } = config;
    frameElement.style.top = `${-buffer}px`;
    // inits linked list
    this.dataArray = ContinuousScrollHandler.initDataArray(
      [...dataArray],
      this.looping
    );

    // populates frameElement and creates dictionary of nodes: ado
    this.adoElementDictionary = ContinuousScrollHandler.initAdoElDictionary(
      {
        buffer,
        dataArray: this.dataArray,
        frameElement,
        looping: this.looping,
        targetHeight,
        model: this.model
      }
    );

    this.frameElement = frameElement;

    // for continuous, don't search the linked list
    if (!this.looping) {
      this.firstAdo = this.dataArray[0];
      this.lastAdo = this.dataArray[this.dataArray.length - 1];
    }

    return true;
  }

  unshift(): number {
    return this.handler(true);
  }

  push(): number {
    return this.handler(false);
  }

  private newIndex(oldIndex: number): number {
    return (this.dataArray.length + oldIndex) % this.dataArray.length;
  }
}
