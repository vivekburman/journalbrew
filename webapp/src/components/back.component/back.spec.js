import React from 'react';
import { shallow } from 'enzyme';
import Back from './back';

const setUp = (props={}) => {
  const component = shallow(<Back.WrappedComponent history={{push: null}} />);
  return component;
}

describe('Testing Back link', () => {
  let component;
  beforeEach(() =>{
    component = setUp();
  });
  it('Back link should render without errors', () => {
    expect(component.find(`[data-test="back-icon"]`).length).toBe(1);
  });
});
