import AtomicDateObject from "../../models/AtomicDateObject";

export default interface BuildConfiguration {
  buffer: number;
  dataArray: AtomicDateObject[];
  continuousScroll: boolean;
  frameElement: HTMLElement;
  targetHeight: number;
}
