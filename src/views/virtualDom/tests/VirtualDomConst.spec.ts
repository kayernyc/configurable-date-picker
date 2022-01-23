import { addElement } from '../VirtualDomConst';
import AtomicDateObject from '../../../models/AtomicDateObject';
import WeekDateObject from '../../../models/WeekDateObject';

describe('addElement', () => {

  it('exists', () => {
    expect(typeof addElement).toBe('function');
  });

  it('returns an AtomicDateObject element', () => {
    const ado = new AtomicDateObject(
      new Date(),
      ['en-US'],
      { weekday: 'long' },
      1
    );
    const element: HTMLDivElement = addElement(ado, 1) as HTMLDivElement;
    console.log(element.className)
    expect(typeof element).toBe('object');
    expect(element.className).toBe('ado-date-view');
  });

  it('returns an AtomicDateObject element', () => {
    const mon = new Date('Mon Jan 17 2022 12:35:06 GMT-0500');
    const sun = new Date('Sun Jan 16 2022 12:35:06 GMT-0500');
    const sat = new Date('Sat Jan 15 2022 12:35:06 GMT-0500');
    const fri = new Date('Fri Jan 14 2022 12:35:06 GMT-0500');
    const thu = new Date('Thu Jan 13 2022 12:35:06 GMT-0500');
    const wed = new Date('Wed Jan 12 2022 12:35:06 GMT-0500');
    const tue = new Date('Tue Jan 11 2022 12:35:06 GMT-0500');

    const ado = new WeekDateObject(
      [
        mon, sun, sat, fri, thu, wed, tue
      ],
      ['en-US'],
      { weekday: 'narrow' },
      1
    );
    const element: HTMLDivElement = addElement(ado, 1) as HTMLDivElement;
    console.log(element.className)
    expect(typeof element).toBe('object');
    expect(element.className).toBe('ado-week-view');
  });
});
