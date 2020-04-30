const SHOW_NOTIFICATION = 'SHOW_NOTIFICATION';
const HIDE_NOTIFICATION = 'HIDE_NOTIFICATION';

const showNotification = () => ({
  type: SHOW_NOTIFICATION,
  payload: true
});

const hideNotification = () => ({
  type: HIDE_NOTIFICATION,
  payload: false
});
export {
  hideNotification,
  showNotification,
  SHOW_NOTIFICATION,
  HIDE_NOTIFICATION
};