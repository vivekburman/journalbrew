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
const searchByTitle = (query, rangeStart, rangeEnd) => {
  return search(query, TSNEnum.SEARCH_TYPES.TITLE, rangeStart, rangeEnd);
}
const searchByTime = (query, rangeStart, rangeEnd) => {
  return search(query, TSNEnum.SEARCH_TYPES.TIME, rangeStart, rangeEnd);
}
const searchByLocation = (query, rangeStart, rangeEnd) => {
  return search(query, TSNEnum.SEARCH_TYPES.LOCATION, rangeStart, rangeEnd);
}
const searchByAND = (query, rangeStart, rangeEnd) => {
  return search(query, TSNEnum.SEARCH_TYPES.AND, rangeStart, rangeEnd);
}
const searchByDefault = (query, rangeStart, rangeEnd) => {
  return search('default', TSNEnum.SEARCH_TYPES.DEFAULT, rangeStart, rangeEnd);
}

export {
  searchByTitle,
  searchByTag,
  searchByTime,
  searchByLocation,
  searchByAND,
  search as searchWithoutType,
  searchByDefault
}