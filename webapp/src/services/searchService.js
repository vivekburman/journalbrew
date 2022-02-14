import { axiosPost } from '../helpers/httpReq';
import { TSNEnum } from '../helpers/tsnenum';

const search = (query, type, rangeStart, rangeEnd) => {
  return axiosPost(`api/search`, {
      filter: {
        type,
        query,
        rangeStart,
        rangeEnd
      }
    });
}

const searchByTag = (query, rangeStart, rangeEnd) => {
  return search(query, TSNEnum.SEARCH_TYPES.TAG, rangeStart, rangeEnd);
}
const searchByTitle = (query) => {
  return search(query, TSNEnum.SEARCH_TYPES.TITLE, rangeStart, rangeEnd);
}
const searchByTime = (query) => {
  return search(query, TSNEnum.SEARCH_TYPES.TIME, rangeStart, rangeEnd);
}
const searchByLocation = (query) => {
  return search(query, TSNEnum.SEARCH_TYPES.LOCATION, rangeStart, rangeEnd);
}
const searchByAND = (query) => {
  return search(query, TSNEnum.SEARCH_TYPES.AND, rangeStart, rangeEnd);
}

export {
  searchByTitle,
  searchByTag,
  searchByTime,
  searchByLocation,
  searchByAND,
  search as searchWithoutType
}