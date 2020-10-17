const { SET_POST_INFO } = require("./post.action");

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

export default handlePostInfo;