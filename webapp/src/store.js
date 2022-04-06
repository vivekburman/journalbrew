import { createStore, applyMiddleware } from 'redux';
import logger from 'redux-logger';
import rootReducer from './reducers/rootReducer';

const middleWares = process.env.NODE_ENV === 'production' ? [] : [logger];

const store = createStore(rootReducer, applyMiddleware(...middleWares));

export {
  store as default,
  middleWares
};