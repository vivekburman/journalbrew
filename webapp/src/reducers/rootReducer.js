import { combineReducers } from 'redux';
import accordianReducer from './click/accordian.reducer';
import resizeReducer from './window/resize.reducer';
export default combineReducers({
    accordian: accordianReducer,
    window: resizeReducer
});