const { SET_POST_INFO, SET_EDITOR_DATA } = require("./post.action");

const handlePostInfo = (state={}, action) => {
  switch(action.type) {
    case SET_POST_INFO:
      return {
        ...state,
        postInfo: action.payload
      };
    default:
      return state
  };
};

const handleEditorData = (state={}, action) => {
  switch(action.type) {
    case SET_EDITOR_DATA:
      return {
        ...state,
        data: action.payload
      };
    default:
      return state;
  }
}

export {
  handleEditorData,
  handlePostInfo
};