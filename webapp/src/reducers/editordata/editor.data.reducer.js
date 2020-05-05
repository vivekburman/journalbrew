import { SAVE_DATA } from './editor.data.action';
export const saveEditorDataReducer = (state={}, action) => {
  switch (action.type) {
    case SAVE_DATA:
      return {
        ...state,
        ...action.payload
      };
  
    default:
      return state;
  }
}