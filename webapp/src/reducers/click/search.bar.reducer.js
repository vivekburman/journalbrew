import { SHOW_SEARCH_BAR, HIDE_SEARCH_BAR } from "./search.bar.action";

const handleSearchBar = (state={}, action) => {
  switch (action.type) {
    case SHOW_SEARCH_BAR:
    case HIDE_SEARCH_BAR:
      return {
        ...state,
        isOpen: action.payload
      } 
    default:
      return state;
  }
};

export default handleSearchBar;