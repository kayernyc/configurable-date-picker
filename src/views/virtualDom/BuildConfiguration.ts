import AtomicDateObject from "../../models/AtomicDateObject";

export default interface BuildConfiguration {
  buffer: number;
  dataArr: AtomicDateObject[];
  continuousScroll: boolean;
  frameElement:HTMLElement;
  targetHeight: number;
}
