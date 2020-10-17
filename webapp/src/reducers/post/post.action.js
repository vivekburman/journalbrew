const SET_POST_INFO = 'SET_POST_INFO';

const setPostInfo = (payload) => ({
  type: SET_POST_INFO,
  payload: payload
});

export {
  SET_POST_INFO,
  setPostInfo
}