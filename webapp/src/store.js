import { createStore, applyMiddleware } from 'redux';
import logger from 'redux-logger';
import rootReducer from './reducers/rootReducer';

const middleWares = [];

const store = createStore(rootReducer, applyMiddleware(...middleWares));

export default store;