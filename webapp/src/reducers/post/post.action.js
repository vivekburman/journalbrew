const SET_POST_INFO = 'SET_POST_INFO';
const SET_EDITOR_DATA = 'SET_EDITOR_DATA';
const setPostInfo = (payload) => ({
  type: SET_POST_INFO,
  payload: payload
});

const setEditorData = (payload) => ({
  type: SET_EDITOR_DATA,
  payload: payload
});

export {
  SET_POST_INFO,
  setPostInfo,
  SET_EDITOR_DATA,
  setEditorData
}
