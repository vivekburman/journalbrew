import React from 'react';
import {mount, shallow} from 'enzyme';
import {MemoryRouter} from 'react-router';
import {Provider} from 'react-redux';
import {testStore} from '../../testUtils';
import SearchNLogoComponent from './search.logo';
import configureStore from 'redux-mock-store';
import renderer from 'react-test-renderer';
import { openSearchBar, closeSearchBar } from '../../reducers/click/search.bar.action';
import handleSearchRequest from '../../reducers/search/search.action';

const mockStore = configureStore([]);

const routeSetUp = (props={}) => {
  return (initialEntries=[]) => {
    return mount(
        <MemoryRouter initialEntries={initialEntries}>
          <Provider store={testStore}>
            <SearchNLogoComponent {...props}/>
          </Provider>
        </MemoryRouter>,
    );
  };
};

const mockStoreSetUp = (props={}) => {
  const store = mockStore(props);
  store.dispatch = jest.fn();
  const component = renderer.create(
      <MemoryRouter initialEntries={['/']}>
        <Provider store={store}>
          <SearchNLogoComponent />
        </Provider>
      </MemoryRouter>,
  );
  return {store, component};
};


describe('Search component test', () => {
  let routeWrapper;
  const defaultStore = {
    search: {
      searchText: 'test',
    },
    searchBar: {
      isSearchBarOpen: true,
    },
    window: {
      windowSize: 1200,
    },
  };
  it('Should render properly', () => {
    routeWrapper = routeSetUp();
    const wrapper = routeWrapper(['/']);
    expect(wrapper.find('.logo').length).toBe(1);
    expect(wrapper.find('.search-input').length).toBe(1);
    expect(wrapper.find('.icon-img-search').length).toBe(1);
  });

  it('Should render dropdown properly', () => {
    const {component} = mockStoreSetUp(defaultStore);
    expect(component.toJSON().children[1].children[0].children[0].children[1].props.className).toContain('suggestion-list-container');
  });
  it('Should not render dropdown', () => {
    const {component} = mockStoreSetUp({
      ...defaultStore,
      search: {
        searchText: '',
      },
    });
    expect(component.toJSON().children[1].children[0].children[0].children[1]).toBe(undefined);
  });

  it('Search input box should be hidden', () => {
    const {component} = mockStoreSetUp({
      ...defaultStore,
      search: {
        searchText: '',
      },
      window: {
        windowSize: 200,
      },
    });
    expect(component.toJSON().children[1].children[0].children[0].children[0].children[2].props.className).toContain('collapse-search');
  });

  it('test for opening of search bar', () => {
    const {store, component} = mockStoreSetUp({
      search: {
        searchText: '',
      },
      searchBar: {
        isSearchBarOpen: false,
      },
      window: {
        windowSize: 200,
      },
    });
    renderer.act(() => {
      component.root.findAllByType('img')[1].props.onClick();
    });
    expect(store.dispatch).toHaveBeenCalledTimes(1);
    expect(store.dispatch).toHaveBeenCalledWith(openSearchBar({payload: true}));
  });
  it('test for collapsing of search bar', () => {
    const {store, component} = mockStoreSetUp({
      search: {
        searchText: '',
      },
      searchBar: {
        isSearchBarOpen: false,
      },
      window: {
        windowSize: 200,
      },
    });
    renderer.act(() => {
      component.root.findAllByType('img')[0].props.onClick();
    });
    expect(store.dispatch).toHaveBeenCalledTimes(1);
    expect(store.dispatch).toHaveBeenCalledWith(closeSearchBar({payload: false}));
  });
  it('test for blur of search bar', () => {
    const {store} = mockStoreSetUp({
      ...defaultStore,
      search: {
        searchText: '',
      },
      searchBar: {
        isSearchBarOpen: false,
      },
    });

    // because blur has a setTimeout of 100ms
    setTimeout(() =>{
      expect(store.dispatch).toHaveBeenCalledTimes(1);
      expect(store.dispatch).toHaveBeenCalledWith(handleSearchRequest({payload: ''}));
    }, 200);
  });
  // TODO: on selecting something also closes
});
