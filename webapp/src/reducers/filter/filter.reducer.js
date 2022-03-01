import { SET_FILTER_TYPE } from "./filter.action";

const INITIAL_STATE = {
    filterText: ''
}
const filterReducer = (state=INITIAL_STATE, action) => {
    switch(action.type) {
        case SET_FILTER_TYPE: 
            return {
                ...state,
                filterText: action.payload
            };
        default: 
            return state;
    }
}
export default filterReducer;