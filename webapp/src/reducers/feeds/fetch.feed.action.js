const FETCH_FEED = 'FETCH_FEED';

const fetchFeed = (type) => ({
  type: FETCH_FEED,
  payload: type
});

export {
  FETCH_FEED,
  fetchFeed
};