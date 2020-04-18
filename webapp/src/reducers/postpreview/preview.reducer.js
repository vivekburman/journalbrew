import { SHOW_PREVIEW, HIDE_PREVIEW } from './preview.action';
export const handlePreviewReducer = (state={}, action) => {
  switch (action.type) {
    case SHOW_PREVIEW:
      return {
        ...state,
        preview: action.payload,
      };
    case HIDE_PREVIEW:
      return {
        ...state,
        preview: action.payload
      };  
    default:
      return state;
  }
};


