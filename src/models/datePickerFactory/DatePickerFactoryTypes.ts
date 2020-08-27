import AtomicDateObject from "../AtomicDateObject";
import WeekDateObject from "../WeekDateObject";

type AtomicDateObjectCreator = (index: number) => AtomicDateObject[] | WeekDateObject[];

export {
  AtomicDateObjectCreator
}
