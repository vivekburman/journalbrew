import { SHOW_COMPLETE_POST } from './showcompletepost.action';

const showCompletePostReducer = (state={}, action) => {
  switch (action.type) {
    case SHOW_COMPLETE_POST:
     return {
       ...state,
       postID: action.payload
     } 
    default:
      return state;
  }
}
export default showCompletePostReducer;