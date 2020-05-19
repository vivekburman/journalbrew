import { FETCH_FEED } from "./fetch.feed.action";

const handleFeedLoad = (state={}, action) => {
  switch (action.type) {
    case FETCH_FEED:
      return {
        ...state,
        fetchFeedOfType: action.payload
      };
    default:
      return state;
  }
}

export default handleFeedLoad;