/**
 * continuousScroll means there is no fixed first or last element
 * Looping means that members pop or shift but the array doesn't get extended.
 *
 * If continuousScroll (not looping) virtual dom insures there are enough points
 * above and below.
 * If looping, checks that full set is enough for looping.
 */

interface IntersectedAdo {
  updateIntersectedAdo: (ado: AtomicDateObject | WeekDateObject) => void;
}

export { IntersectedAdo }

// type EventListenerFunction = (evt: MouseEvent) => void;

import AtomicDateObject from '../../models/AtomicDateObject';
import BuildConfiguration from './BuildConfiguration';
import ContinuousScrollHandler from './ContinuousScrollHandler';

import { addElement, OPEN_VIEW_HEIGHT } from './VirtualDomConst';
import WeekDateObject from '../../models/WeekDateObject';

// https://stackoverflow.com/questions/58036689/using-mutationobserver-to-detect-when-a-node-is-added-to-document
// { (options?: ScrollToOptions): void; (x: number, y: number): void; }

export default class VirtualDom {
  // If a class type can have more than the
  // limit, then there may still be a default virtual dom.
  static last<T>(array: T[]): T {
    return array[array.length - 1];
  }

  private buffer = 20;
  private vdFrameElement: HTMLElement;
  private containerHeight: number;

  private _intersectedAdoProxy?: IntersectedAdo;

  private continuousScrollHandler: ContinuousScrollHandler;

  constructor(continuousScrollHandler: ContinuousScrollHandler) {
    this.continuousScrollHandler = continuousScrollHandler;
  }

  private wheelHander = (event: WheelEvent) => {
    // unicorn-disable-line: unicorn/prefer-spread
    const top = Number.parseInt(this.frameElement.style.top || '0px', 10);

    let { deltaY } = event;
    const valence = Math.abs(deltaY) / deltaY;
    deltaY = Math.min(Math.abs(deltaY), 3) * valence;

    let elementHeight: number
    let newTop = top + deltaY;
    let newIntersectedAdo: AtomicDateObject | WeekDateObject

    if (newTop >= -(this.buffer * 0.5)) {
      [elementHeight, newIntersectedAdo] = this.continuousScrollHandler.unshift();
    } else if (newTop < -(this.buffer * 2)) {
      [elementHeight, newIntersectedAdo] = this.continuousScrollHandler.push();
    }

    newTop += elementHeight || 0;

    if (this._intersectedAdoProxy && newIntersectedAdo) {
      this._intersectedAdoProxy.updateIntersectedAdo(newIntersectedAdo);
    }

    this.frameElement.style.top = `${newTop}px`;
  };

  private initializeListeners = (
    frameElement: HTMLElement = this.frameElement
  ) => {
    frameElement.addEventListener('wheel', this.wheelHander, { passive: true });
    if (this._intersectedAdoProxy) {
      this._intersectedAdoProxy.updateIntersectedAdo(this.continuousScrollHandler.headElement())
    }
  };

  private initVirtualDomFrameElement() {
    this.vdFrameElement = document.createElement('div');
    this.vdFrameElement.style.top = '0px';
    this.vdFrameElement.className = 'vd-container';
  }

  private initNormalScroll(config: BuildConfiguration) {
    const { dataArray, frameElement, targetHeight } = config;
    for (const [i, ado] of dataArray.entries()) {
      frameElement.append(addElement(ado, i));
      if (frameElement.offsetHeight > targetHeight) {
        break;
      }
    }
  }

  /**
   * @param arr
   *
   * builds initial set of containers.
   * @param config
   */
  private buildElementSetForVirtualDom = (config: BuildConfiguration) => {
    if (!config.continuousScroll) {
      this.initNormalScroll(config)
    }

    if (this.continuousScrollHandler.initFrame(config)) {
      this.initializeListeners()
    }
  };

  // PUBLIC API
  get frameElement(): HTMLElement {
    if (this.vdFrameElement === undefined) {
      this.initVirtualDomFrameElement();
    }
    return this.vdFrameElement;
  }

  set intersectedAdoProxy(value: IntersectedAdo) {
    //
    this._intersectedAdoProxy = value;
  }

  /**
   * @param dataArray AtomicDateObject[]
   * @param atomicDateObjectArr
   * @param atomicDateObjectArray
   * @param containerElement
   * @param atomicDateObjectArr
   * @param containerElement
   * @param atomicDateObjectArr
   * @param containerElement
   * @param frameElement HTMLElement
   *
   * When the view scrolls continuously
   * this is the initial build
   * @param className
   * @param className
   * @param className
   */
  buildView(
    atomicDateObjectArray: AtomicDateObject[] | WeekDateObject[],
    containerElement?: HTMLElement,
    frameElement: HTMLElement = this.frameElement,
    className?: string
  ): void {
    // clear out previous children
    // TODO: remove event listeners
    const { buffer, buildElementSetForVirtualDom } = this;

    if (!containerElement && this.containerHeight === undefined) {
      throw new Error(
        'BuildView called without initialization. Initialize container element first.'
      );
    } else if (containerElement) {
      this.containerHeight = Math.max(containerElement.offsetHeight, OPEN_VIEW_HEIGHT)
    }

    if (className) {
      frameElement.className += ` ${className}`;
    }

    frameElement.innerHTML = '';
    const config: BuildConfiguration = {
      buffer,
      dataArray: atomicDateObjectArray,
      continuousScroll: true,
      frameElement,
      targetHeight: this.containerHeight + (3 * buffer),
    };

    buildElementSetForVirtualDom(config);
  }

  deallocate(): void {
    // clean up all listeners
  }
}
