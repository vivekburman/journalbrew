const SHOW_LOGIN = 'SHOW_LOGIN';
const HIDE_LOGIN = 'HIDE_LOGIN';

const showLogin = () => ({
  type: SHOW_LOGIN,
  payload: true
});
const hideLogin = () => ({
  type: HIDE_LOGIN,
  payload: false
});

export {
  SHOW_LOGIN,
  HIDE_LOGIN,
  showLogin,
  hideLogin
};