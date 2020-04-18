import { combineReducers } from 'redux';
import accordianReducer from './click/accordian.reducer';
import resizeReducer from './window/resize.reducer';
import searchReducer from './search/search.reducer';
import { handlePreviewReducer } from './postpreview/preview.reducer';
import { saveEditorDataReducer } from './editordata/editor.data.reducer';
export default combineReducers({
    accordian: accordianReducer,
    window: resizeReducer,
    search: searchReducer,
    preview: handlePreviewReducer,
    editorData: saveEditorDataReducer
});