import { SHOW_FILTER_ERROR, SHOW_FILTER_RESULT, SHOW_FILTER_START } from "./filter.action";

const INITIAL_STATE = {
    loading: null,
    error: null,
    filterResult: null
}
const filterReducer = (state=INITIAL_STATE, action) => {
    switch(action.type) {
        case SHOW_FILTER_START: 
        case SHOW_FILTER_ERROR: 
        case SHOW_FILTER_RESULT: 
            return {
                ...state,
                filter: action.payload
            };
        default: 
            return state;
    }
}
export default filterReducer;