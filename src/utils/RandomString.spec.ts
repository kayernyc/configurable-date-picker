import { RandomString } from './RandomString';

describe('RandomString', () => {
  it('exists', () => {
    expect(typeof RandomString).toBe('function');
  });

  it('returns a string', () => {
    const rando = RandomString()
    expect(typeof rando).toBe('string');
  });

  it('returns a string 5 characters long if passed 5 as a length', () => {
    const rando = RandomString(5)
    expect(rando.length).toEqual(5)
  })

  it('returns an empty string if passed 0 as a length', () => {
    const rando = RandomString(0)
    expect(rando.length).toEqual(0)
  });
});
