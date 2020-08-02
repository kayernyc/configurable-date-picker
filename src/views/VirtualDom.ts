type EventListenerFunction = (evt: MouseEvent) => void;

// https://stackoverflow.com/questions/58036689/using-mutationobserver-to-detect-when-a-node-is-added-to-document
// { (options?: ScrollToOptions): void; (x: number, y: number): void; }
import AtomicDateObject from "../models/AtomicDateObject";

export default class VirtualDom {
  // If a class type can have more than the
  // limit, then there may still be a default virtual dom.
  static last<T>(arr: T[]): T {
    return arr[arr.length - 1];
  }

  static numElementsLimit = 12;
  private vdFrameElement: HTMLElement;
  private elementArray: HTMLElement[];

  private eventListeners: EventListenerFunction[];
  private contentHeight: number;
  private frameHeight: number;

  private wheelHander = (evt: WheelEvent) => {
    const childrenArr = Array.from(
      this.vdFrameElement.children
    ) as HTMLElement[];
    const unshiftLimit = childrenArr[0].offsetHeight;
    const lastElementHeight = VirtualDom.last(childrenArr).offsetHeight;
    const popLimit = this.contentHeight - lastElementHeight;
    const parentFrameHeight = this.vdFrameElement.parentElement.offsetHeight;

    const top = parseInt(this.vdFrameElement.style.top || "0px", 10);

    let { deltaY } = evt;
    const valence = Math.abs(deltaY) / deltaY;
    deltaY = Math.max(Math.abs(deltaY), 3) * valence;
<<<<<<< HEAD
    const newTop = top + deltaY;

    this.vdFrameElement.style.top = newTop + "px";

    if (newTop > 0) {
      // add to beginning
=======
    let newTop = top + deltaY;

    if (newTop > 0) {
      // add to beginning
      const unshiftElement = childrenArr.pop() as HTMLElement;
      this.vdFrameElement.prepend(unshiftElement);
      newTop -= unshiftElement.offsetHeight;
    } else if (this.contentHeight + newTop < parentFrameHeight) {
      const pushElement = childrenArr.shift() as HTMLElement;
      this.vdFrameElement.appendChild(pushElement);
      newTop += pushElement.offsetHeight;
>>>>>>> basic looping
    }

    this.vdFrameElement.style.top = newTop + "px";
  };

  private initializeListeners = (
    frameElement: HTMLElement = this.frameElement
  ) => {
    frameElement.addEventListener("wheel", this.wheelHander);
  };

  private initVirtualDomFrameElement() {
    this.vdFrameElement = document.createElement("div");
    this.vdFrameElement.style.top = "0px";
    this.vdFrameElement.className = "vd-container";
    this.frameHeight = this.vdFrameElement.offsetHeight;
  }

  private calculateContentHeight(elementArray: AtomicDateObject[]) {
    // run this when view is added to dom and calculate real height
    return 20 * elementArray.length;
  }

  /**
   *
   * @param arr
   *
   * builds initial set of containers.
   */
  private buildElementSetForVirtualDom = (arr: AtomicDateObject[]) => {
    // populate view with elements
    // subset arr to be max limit long
    arr.forEach((ado: AtomicDateObject) => {
      const el = document.createElement("div");
      el.innerHTML = ado.viewString;

      this.frameElement.appendChild(el);
    });
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
   * @param arr AtomicDateObject[]
   * @param frameElement HTMLElement
   *
   * When the view scrolls continuously
   * this is the initial build
   */
  buildView(
    atomicDateObjectArr: AtomicDateObject[],
    frameElement: HTMLElement = this.frameElement
  ) {
    // clear out previous children
    // TODO: remove event listeners
    const {
      buildElementSetForVirtualDom,
      frameHeight,
      calculateContentHeight,
      initializeListeners,
    } = this;
    let { contentHeight } = this;

    frameElement.innerHTML = "";

    buildElementSetForVirtualDom(atomicDateObjectArr);

    this.contentHeight = calculateContentHeight(atomicDateObjectArr);
    console.log(this.contentHeight, "***");

    if (this.contentHeight > frameHeight) {
      // init virtual dom behavior
      initializeListeners();
    }
  }

  deallocate() {
    // clean up all listeners
  }
}
