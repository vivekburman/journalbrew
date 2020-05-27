import { applyMiddleware, createStore } from 'redux';
import rootReducer from '../reducers/rootReducer';
import { middleWares } from '../store';

export const testStore = createStore(rootReducer,  applyMiddleware(...middleWares));