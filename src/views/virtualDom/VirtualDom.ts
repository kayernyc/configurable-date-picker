type EventListenerFunction = (evt: MouseEvent) => void;

// https://stackoverflow.com/questions/58036689/using-mutationobserver-to-detect-when-a-node-is-added-to-document
// { (options?: ScrollToOptions): void; (x: number, y: number): void; }
import AtomicDateObject from "../../models/AtomicDateObject";

export default class VirtualDom {
  // If a class type can have more than the
  // limit, then there may still be a default virtual dom.
  static last<T>(arr: T[]): T {
    return arr[arr.length - 1];
  }

  static numElementsLimit = 12;

  private beginningBuffer = 40;
  private endingBuffer = 40;
  private vdFrameElement: HTMLElement;
  private elementArray: HTMLElement[];

  private eventListeners: EventListenerFunction[];

  private contentHeight: number;
  private frameHeight: number;
  private containerHeight: number;

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
  private buildElementSetForVirtualDom = (arr: AtomicDateObject[], frameElement:HTMLElement = this.frameElement) => {
    const {beginningBuffer, endingBuffer} = this
    const targetHeight = this.containerHeight + beginningBuffer + endingBuffer;
    const workingArr = [...arr];
    let offset = 0;

    function addElement(ado: AtomicDateObject): HTMLElement {
      const el = document.createElement("div");
      el.innerHTML = ado.viewString
      return el
    }

    while (frameElement.offsetHeight < targetHeight) {
      let ado: AtomicDateObject
      if (frameElement.offsetHeight < this.beginningBuffer) {
        // tslint:disable-next-line: no-unused-expression
        workingArr.unshift(workingArr.pop())[0]
        ado = workingArr[0]
        const el = addElement(ado)
        frameElement.appendChild(el);
        frameElement.style.top = ((parseInt(frameElement.style.top, 10) || 0) - el.offsetHeight) + 'px'
        offset ++;
        continue;
      }

      ado = workingArr[offset]
      frameElement.appendChild(addElement(ado));
      offset ++;
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
   * @param arr AtomicDateObject[]
   * @param frameElement HTMLElement
   *
   * When the view scrolls continuously
   * this is the initial build
   */
  buildView(
    atomicDateObjectArr: AtomicDateObject[],
    containerElement: HTMLElement,
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

    this.containerHeight = containerElement.offsetHeight;
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
