import { SAVE_DATA } from './editor.data.action';
export const saveEditorDataReducer = (state={}, action) => {
  switch (action.type) {
    case SAVE_DATA:
    console.log(action.payload);
      return {
        ...state,
        editorData: action.payload
      };
  
    default:
      return state;
  }
}