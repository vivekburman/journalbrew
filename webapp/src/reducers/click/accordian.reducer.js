const INITIAL_STATE = {
    isOpen: undefined
};
const accordianReducer = (state= INITIAL_STATE, action) => {
    switch(action.type) {
        case 'CLOSE_ACCORDIAN':
            return {
                ...state,
                isOpen: action.payload
            }
        case 'OPEN_ACCORDIAN': 
            return {
                ...state,
                isOpen: action.payload
            }
        default: 
            return state;
    }
}
export default accordianReducer;