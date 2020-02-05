const INITIAL_STATE = {
    windowSize: window.innerWidth,
    hasWindowResized: 0
}
const resizeReducer = (state= INITIAL_STATE, action) => {
    switch(action.type) {
        case 'WINDOW_RESIZE':
            if (action.payload !== state.windowSize) {
                return {
                    ...state,
                    windowSize: action.payload,
                    hasWindowResized: state.hasWindowResized + 1
                }
            }
            return state;
        default: 
            return state;
    }
}
export default resizeReducer;