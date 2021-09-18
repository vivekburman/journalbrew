import store from '../store';
function getToken() {
  return store.getState().user.currentUser ? store.getState().user.currentUser.token : null;
}

export {
  getToken
}