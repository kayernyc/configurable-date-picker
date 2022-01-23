import VirtualDom from '../VirtualDom';
import AtomicDateObject from '../../../models/AtomicDateObject';
import WeekDateObject from '../../../models/WeekDateObject';

describe('VirtualDom.last', () => {
  it('to be a function', () => {
    expect(typeof VirtualDom.last).toBe('function');
  });

  it('.last returns the last item', () => {
    const testArr = ['bob', 'tom', 'suzy', 'martha'];
    const result = VirtualDom.last(testArr);
    expect(result).toBe('martha');
  });
});

// describe('VirtualDom.last', () => {
//   it('to be a function', () => {
//     expect(typeof VirtualDom.last).toBe('function');
//   });

//   it('.last returns the last item', () => {
//     const testArr = ['bob', 'tom', 'suzy', 'martha'];
//     const result = VirtualDom.last(testArr);
//     expect(result).toBe('martha');
//   });
// });

// eslint-disable-next-line max-len
// node node_modules/jest/bin/jest.js -i src/views/virtualDom/tests/VirtualDom.spec.ts // -t "has a static function"
