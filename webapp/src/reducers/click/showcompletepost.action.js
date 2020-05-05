const SHOW_COMPLETE_POST = 'SHOW_COMPLETE_POST';

const showCompletePost = (postID) => ({
  type: SHOW_COMPLETE_POST,
  payload: postID
});
export {
  showCompletePost,
  SHOW_COMPLETE_POST
};