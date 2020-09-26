import AtomicDateObject from '../../models/AtomicDateObject';
import BuildConfiguration from './BuildConfiguration';
import DatePickerFactory from '../../models/datePickerFactory/DatePickerFactory';
import WeekDateObject from '../../models/WeekDateObject';

import { DATA_ADO_STRING, DATA_TAG_STRING, addElement, DateElementHandlerFunction } from './VirtualDomConst';

type ScrollHandlingFunction = (valence: boolean, frameElement?: HTMLElement) => number;
type AdoElementDictionary = { [id: string]: AtomicDateObject };

interface AdoElDictionaryFactoryConfig {
  buffer: number;
  dataArray: AtomicDateObject[];
  dateElementHandlerFunction: DateElementHandlerFunction;
  frameElement: HTMLElement;
  looping: boolean;
  model: DatePickerFactory;
  targetHeight: number;
}

export default class ContinuousScrollHandler {
  private dataArray: AtomicDateObject[];
  private frameElement: HTMLElement;
  private model: DatePickerFactory;

  private looping = false;
  private handler: ScrollHandlingFunction;

  private firstAdo: AtomicDateObject;
  private lastAdo: AtomicDateObject;

  private adoElementDictionary: AdoElementDictionary = {};

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
   * @param config
   */
  static initAdoElDictionary(
    config: AdoElDictionaryFactoryConfig
  ): { [id: string]: AtomicDateObject } {
    const adoElementDictionary: { [id: string]: AtomicDateObject } = {};
    const { dataArray, dateElementHandlerFunction, frameElement, looping, model, targetHeight } = config;

    let index = 0;
    while (frameElement.offsetHeight <= targetHeight) {
      if (index >= dataArray.length) {
        if (looping) {
          throw new Error("Looping view doesn't have enough dates");
        }
        const newIndex = dataArray[dataArray.length - 1].index + 1;
        const newAdos = model.getAtomicDateObjectByIndex(newIndex);

        for (const newAdo of newAdos) {
          dataArray.push(newAdo);
        }
      }

      const ado = dataArray[index];
      const element = addElement(ado, index, dateElementHandlerFunction);
      const key = element.getAttribute(DATA_TAG_STRING);
      adoElementDictionary[key] = ado;

      frameElement.append(element);
      index++;
    }

    return adoElementDictionary;
  }

  constructor(
    model: DatePickerFactory,
    looping = false,
  ) {
    if (looping) {
      this.looping = looping;
      this.handler = this.loop.bind(this) as ScrollHandlingFunction;
      return;
    }

    // only hold a reference to the model if
    // it's needed
    this.model = model;
    this.handler = this.continuousScroll.bind(this) as ScrollHandlingFunction;
  }

  private dateElementHander: DateElementHandlerFunction = (event: MouseEvent) => {
    let selectedDate: Date;

    const element: HTMLElement = event.currentTarget as HTMLElement;
    const dataTag = element.getAttribute(DATA_TAG_STRING);
    const ado: AtomicDateObject | WeekDateObject = this.adoElementDictionary[dataTag];

    if (ado instanceof WeekDateObject) {
      const dateElement = event.target as HTMLElement;
      const index = dateElement.getAttribute(DATA_ADO_STRING);
      const dateAdo = ado.week[index] as AtomicDateObject;
      selectedDate = dateAdo.date;
    } else {
      selectedDate = ado.date;
    }
    console.log('continuous scroll', selectedDate);
    return true
  }

  private firstElement(frameElement = this.frameElement): HTMLElement {
    if (frameElement.children.length === 0) {
      throw new Error('FrameElement has no children');
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
    const tailElement = valence ? this.frameElement.firstChild as HTMLElement : this.frameElement.lastChild as HTMLElement;
    const key = tailElement.getAttribute(DATA_TAG_STRING);
    const tailAdo = this.adoElementDictionary[key];
    let adoArray: AtomicDateObject[];
    let newAdo: AtomicDateObject;
    let newElement: HTMLElement;

    if (valence) {
      if (tailAdo.prev === undefined) {
        adoArray = this.model.getAtomicDateObjectByIndex(tailAdo.index - 1);
        tailAdo.prev = adoArray[adoArray.length - 1];
        tailAdo.prev.next = tailAdo;
      }
      newAdo = tailAdo.prev;
      newElement = this.lastElement();
    } else {
      if (tailAdo.next === undefined) {
        adoArray = this.model.getAtomicDateObjectByIndex(tailAdo.index + 1);
        tailAdo.next = adoArray[0];
        tailAdo.next.prev = tailAdo;
      }
      newAdo = tailAdo.next;
      newElement = this.firstElement();
    }

    this.adoElementDictionary[newElement.getAttribute(DATA_TAG_STRING)] = newAdo;
    newElement.innerHTML = newAdo.viewString;

    valence ? frameElement.prepend(newElement) : frameElement.append(newElement);
    return newElement.offsetHeight;
  }

  private loop(valence: boolean, frameElement = this.frameElement): number {
    let newAdo: AtomicDateObject;
    let currentElement: HTMLElement;
    let newElement: HTMLElement;

    if (valence) {
      currentElement = frameElement.children[0] as HTMLElement;
      // last el goes to beginning
      newElement = this.lastElement();
      newAdo = this.adoElementDictionary[currentElement.getAttribute(DATA_TAG_STRING)]
        .prev;
    } else {
      currentElement = frameElement.children[
        frameElement.children.length - 1
      ] as HTMLElement;
      // first el goes to end
      newElement = this.firstElement();
      newAdo = this.adoElementDictionary[currentElement.getAttribute(DATA_TAG_STRING)]
        .next;
    }
    this.adoElementDictionary[newElement.getAttribute(DATA_TAG_STRING)] = newAdo;

    newElement.innerHTML = newAdo.viewString;
    valence ? frameElement.prepend(newElement) : frameElement.append(newElement);
    return newElement.offsetHeight;
  }

  // API
  headElement(frameElement: HTMLElement = this.frameElement, adoElementDictionary: AdoElementDictionary = this.adoElementDictionary): AtomicDateObject | WeekDateObject {
    // Each element adds its height until it becomes possitive.
    let offset = frameElement.offsetTop;

    const elements = Array.from(frameElement.children)
    // teslint:disable-next-line: prefer-for-of
    for (const element of elements) {
      const htmlEL = element as HTMLElement;
      const key = element.getAttribute(DATA_TAG_STRING);
      if (offset > -(htmlEL.offsetHeight * 0.5)) {

        return adoElementDictionary[key];
      }

      offset += htmlEL.offsetHeight;
    }
  }

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
    frameElement.style.top = `-${buffer}px`;
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
        dateElementHandlerFunction: this.dateElementHander,
        frameElement,
        looping: this.looping,
        targetHeight,
        model: this.model
      }
    );

    this.frameElement = frameElement;

    // for continuousScroll, don't search the linked list
    if (!this.looping) {
      this.firstAdo = this.dataArray[0];
      this.lastAdo = this.dataArray[this.dataArray.length - 1];
    }

    return true;
  }

  unshift(): [number, AtomicDateObject] {
    const newOffset = this.handler(true);
    const newIntersectedAdo = this.headElement()
    return [-newOffset, newIntersectedAdo]
  }

  push(): [number, AtomicDateObject] {
    const newOffset = this.handler(false);
    const newIntersectedAdo = this.headElement()
    return [newOffset, newIntersectedAdo]
  }

  private newIndex(oldIndex: number): number {
    return (this.dataArray.length + oldIndex) % this.dataArray.length;
  }
}
