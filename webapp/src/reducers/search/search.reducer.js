const INITIAL_STATE = {
    searchText: ''
}
const searchReducer = (state=INITIAL_STATE, action) => {
    switch(action.type) {
        case 'SEARCH_REQUEST': 
            return {
                ...state,
                searchText: action.payload
            };
        default: 
            return state;
    }
}
export default searchReducer;