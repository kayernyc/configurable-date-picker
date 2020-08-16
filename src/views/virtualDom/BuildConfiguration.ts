import AtomicDateObject from "../../models/AtomicDateObject";

export default interface BuildConfiguration {
  dataArr: AtomicDateObject[];
  buffer: number;
  continuousScroll: boolean;
  frameElement:HTMLElement;
  targetHeight: number;
}
