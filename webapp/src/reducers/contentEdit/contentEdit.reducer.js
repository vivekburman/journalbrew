import { UPDATE_TEXT } from './contentEdit.action';
const INITIAL_TEXT = {
    oldText: null,
};

const textUdpateReducer = (state=INITIAL_TEXT, action) => {
    switch(action.type) {
        case UPDATE_TEXT:
            return {
                ...state,
                oldText: action.payload.oldText,
            }
        default:
            return state
    }
}
export default textUdpateReducer;