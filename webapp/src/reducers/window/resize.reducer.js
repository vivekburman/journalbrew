const INITIAL_STATE = {
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
            return {
                ...state,
                windowSize: action.payload,
                hasWindowResized: state.hasWindowResized
            };
        default: 
            return {
                ...state,
                windowSize: action.payload,
                hasWindowResized: state.hasWindowResized
            };
    }
}
export default resizeReducer;