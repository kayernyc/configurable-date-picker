import ToggleSwitch, { ToggleSwitchProxy } from './ToggleSwitch';

class TestProxy implements ToggleSwitchProxy {
  selectValue(index: number, value: string): boolean {
    return true;
  }
}

describe('ToggleSwitch', () => {
  const toggleSwitch = new ToggleSwitch(['bob', 'buck', 'bip']);
  const testProxy = new TestProxy();
  toggleSwitch.proxy = testProxy;

  const frame = document.createElement('div');
  document.body.append(frame);

  it('exists', () => {
    expect(typeof ToggleSwitch).toBe('function');
  });

  it('holds an array of strings', () => {
    expect(toggleSwitch.valuesArray.length).toBeDefined();
  });

  it('adds radios to the frame', () => {
    const expectation =
      '<form class="toggle-switch"><input type="radio" id="bob" name="bobo" hidden="" value="bob" class="toggle-switch-value"><label for="bob">bob</label><input type="radio" id="buck" name="bobo" hidden="" value="buck" class="toggle-switch-value"><label for="buck">buck</label><input type="radio" id="bip" name="bobo" hidden="" value="bip" class="toggle-switch-value"><label for="bip">bip</label></form>';

    toggleSwitch.append(frame, undefined, 'bobo');
    expect(frame.innerHTML).toBe(expectation);
  });

});
