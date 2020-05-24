import React from 'react';
import {mount} from 'enzyme';
import {MemoryRouter} from 'react-router';
import {Provider} from 'react-redux';
import {testStore} from '../../testUtils';
import ProfileComponent from './profile';
import Notification from '../notification.component/notification.card';
import ProfileDropdown from '../profile.dropdown.component/profile.dropdown';

const routeSetUp = (props={}) => {
  return (initialEntries=[]) => {
    return mount(
        <MemoryRouter initialEntries={initialEntries}>
          <Provider store={testStore}>
            <ProfileComponent {...props} />
          </Provider>
        </MemoryRouter>,
    );
  };
};

describe('Should render logged in visuals', () => {
  let routeWrapper;

  beforeEach(() =>{
    routeWrapper = routeSetUp({currentUser: true});
  });

  it('it should render notifications and user profile icon', () => {
    const wrapper = routeWrapper(['/']);
    expect(wrapper.find(Notification).length).toBe(1);
    expect(wrapper.find(ProfileDropdown).length).toBe(1);
  });

  it('it should render only user profile icon', () => {
    const wrapper = routeWrapper(['/new-story']);
    expect(wrapper.find(Notification).length).toBe(0);
  });
});

describe('Should render loggedOut visuals', () => {
  let routeWrapper;

  beforeEach(() =>{
    routeWrapper = routeSetUp({currentUser: false});
  });

  it('it should render sign in btn', () => {
    const wrapper = routeWrapper(['/']);
    expect(wrapper.find('.sign-in-btn').length).toBe(1);
  });
});
