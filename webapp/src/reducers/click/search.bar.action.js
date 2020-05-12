const SHOW_SEARCH_BAR = 'SHOW_SEARCH_BAR';
const HIDE_SEARCH_BAR = 'HIDE_SEARCH_BAR';

const openSearchBar = () => ({
  type: SHOW_SEARCH_BAR,
  payload: true
});

const closeSearchBar = () => ({
  type: HIDE_SEARCH_BAR,
  payload: false
});

export {
  SHOW_SEARCH_BAR,
  HIDE_SEARCH_BAR,
  openSearchBar,
  closeSearchBar
};