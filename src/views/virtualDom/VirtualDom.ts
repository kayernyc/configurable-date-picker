/**
 * Continuous means there is no fixed first or last element
 * Looping means that members pop or shift but the array doesn't get extended.
 *
 * If continuous (not looping) virtual dom insures there are enough points
 * above and below.
 * If looping, checks that full set is enough for looping.
 */

type EventListenerFunction = (evt: MouseEvent) => void;

import AtomicDateObject from "../../models/AtomicDateObject";
import BuildConfiguration from "./BuildConfiguration";
import ContinuousScrollHandler from "./ContinuousScrollHandler";

import { addElement } from "./VirtualDomConst";
import WeekDateObject from "../../models/WeekDateObject";

// https://stackoverflow.com/questions/58036689/using-mutationobserver-to-detect-when-a-node-is-added-to-document
// { (options?: ScrollToOptions): void; (x: number, y: number): void; }

export default class VirtualDom {
  // If a class type can have more than the
  // limit, then there may still be a default virtual dom.
  static last<T>(arr: T[]): T {
    return arr[arr.length - 1];
  }

  private buffer = 20;
  private vdFrameElement: HTMLElement;
  private containerHeight: number;

  private continuousScrollHandler: ContinuousScrollHandler;

  static initNormalScroll(config: BuildConfiguration): boolean {

    return true
  }

  constructor(continuousScrollHandler: ContinuousScrollHandler) {
    this.continuousScrollHandler = continuousScrollHandler;
  }

  private wheelHander = (evt: WheelEvent) => {
    const childrenArr = Array.from(this.frameElement.children) as HTMLElement[];
    const lastElementHeight = VirtualDom.last(childrenArr).offsetHeight;

    const top = parseInt(this.frameElement.style.top || "0px", 10);

    let { deltaY } = evt;
    const valence = Math.abs(deltaY) / deltaY;
    deltaY = Math.min(Math.abs(deltaY), 3) * valence;
    let newTop = top + deltaY;

    if (newTop > 0) {
      newTop -= this.continuousScrollHandler.unshift();
    } else if (newTop < -this.buffer) {
      newTop += this.continuousScrollHandler.push();
    }

    this.frameElement.style.top = newTop + "px";
  };

  private initializeListeners = (
    frameElement: HTMLElement = this.frameElement
  ) => {
    frameElement.addEventListener("wheel", this.wheelHander, { passive: true });
  };

  private initVirtualDomFrameElement() {
    this.vdFrameElement = document.createElement("div");
    this.vdFrameElement.style.top = "0px";
    this.vdFrameElement.className = "vd-container";
  }

  private initNormalScroll(config: BuildConfiguration) {
    const { dataArray, frameElement, targetHeight } = config;
    for (let i = 0; i < dataArray.length; i++) {
      const ado = dataArray[i];
      frameElement.appendChild(addElement(ado, i));
      if (frameElement.offsetHeight > targetHeight) {
        break;
      }
    }
  }

  /**
   *
   * @param arr
   *
   * builds initial set of containers.
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
  get frameElement() {
    if (this.vdFrameElement === undefined) {
      this.initVirtualDomFrameElement();
    }
    return this.vdFrameElement;
  }

  /**
   *
   * @param dataArray AtomicDateObject[]
   * @param frameElement HTMLElement
   *
   * When the view scrolls continuously
   * this is the initial build
   */
  buildView(
    atomicDateObjectArr: AtomicDateObject[] | WeekDateObject[],
    containerElement?: HTMLElement,
    frameElement: HTMLElement = this.frameElement,
    className?: string
  ) {
    // clear out previous children
    // TODO: remove event listeners
    const { buffer, buildElementSetForVirtualDom } = this;

    if (!containerElement && this.containerHeight === undefined) {
      throw new Error(
        "BuildView called without initialization. Initialize container element first."
      );
    } else if (containerElement) {
      this.containerHeight = containerElement.offsetHeight;
    }

    if (className) {
      frameElement.className += ` ${className}`;
    }

    frameElement.innerHTML = "";
    const config: BuildConfiguration = {
      buffer,
      dataArray: atomicDateObjectArr,
      continuousScroll: true,
      frameElement,
      targetHeight: containerElement.offsetHeight + 2 * buffer,
    };

    buildElementSetForVirtualDom(config);
  }

  deallocate() {
    // clean up all listeners
  }
}
